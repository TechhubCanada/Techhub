#!/usr/bin/env node

import { execFileSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

const root = process.cwd()

function run(command, args, options = {}) {
  try {
    return execFileSync(command, args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      ...options,
    }).trim()
  } catch (error) {
    return ""
  }
}

function readJson(file) {
  const absolutePath = path.join(root, file)
  if (!existsSync(absolutePath)) return null
  return JSON.parse(readFileSync(absolutePath, "utf8"))
}

function unique(values) {
  return [...new Set(values)].filter(Boolean).sort()
}

const statusLines = run("git", ["status", "--short"])
  .split("\n")
  .map((line) => line.trimEnd())
  .filter(Boolean)

function statusPath(line) {
  const pathWithMaybeStatus =
    line.length >= 3 && line[2] === " "
      ? line.slice(3)
      : line.replace(/^[ MADRCU?!]{1,2}\s+/, "")

  return pathWithMaybeStatus.replace(/^.* -> /, "")
}

const changedFiles = unique(
  statusLines
    .map(statusPath)
    .filter((file) => !file.startsWith("node_modules/"))
    .filter((file) => !file.includes("/node_modules/"))
)

const packages = [
  { name: "root", dir: ".", manifest: "package.json" },
  { name: "@techhub/medusa", dir: "medusa", manifest: "medusa/package.json" },
  {
    name: "@techhub/storefront",
    dir: "storefront",
    manifest: "storefront/package.json",
  },
]

function ownerFor(file) {
  if (file.startsWith("medusa/")) return "@techhub/medusa"
  if (file.startsWith("storefront/")) return "@techhub/storefront"
  return "root"
}

function importSpecifiers(file) {
  const absolutePath = path.join(root, file)
  if (!existsSync(absolutePath)) return []
  if (!/\.(c|m)?(j|t)sx?$/.test(file)) return []

  const source = readFileSync(absolutePath, "utf8")
  const matches = source.matchAll(
    /(?:import\s+(?:[^'"]+\s+from\s+)?|export\s+[^'"]+\s+from\s+|require\()\s*["']([^"']+)["']/g
  )

  return unique([...matches].map((match) => match[1]))
}

const owners = unique(changedFiles.map(ownerFor))
const manifests = packages.map((pkg) => ({
  ...pkg,
  data: readJson(pkg.manifest),
}))

const turboDryRun = run("pnpm", ["turbo", "run", "build", "--dry=json"])
const turboTasks = []
if (turboDryRun) {
  try {
    const parsed = JSON.parse(
      turboDryRun
        .split("\n")
        .filter((line) => !line.startsWith("• turbo"))
        .join("\n")
    )
    for (const task of parsed.tasks || []) {
      turboTasks.push(`${task.taskId}: ${task.command}`)
    }
  } catch {
    turboTasks.push("Unable to parse Turbo dry-run JSON.")
  }
}

console.log("# Local Code Review Graph")
console.log("")
console.log("Use this when Gortex is unavailable or not responding.")
console.log("")

console.log("## Changed Files")
if (changedFiles.length === 0) {
  console.log("- No changed files reported by `git status --short`.")
} else {
  for (const file of changedFiles) {
    console.log(`- ${file} -> ${ownerFor(file)}`)
  }
}
console.log("")

console.log("## Impacted Workspaces")
for (const owner of owners.length ? owners : ["root"]) {
  console.log(`- ${owner}`)
}
console.log("")

console.log("## Package Scripts")
for (const manifest of manifests) {
  if (!manifest.data?.scripts) continue
  console.log(`### ${manifest.name}`)
  for (const [name, command] of Object.entries(manifest.data.scripts)) {
    console.log(`- ${name}: \`${command}\``)
  }
  console.log("")
}

console.log("## Imports From Changed Source Files")
let hasImports = false
for (const file of changedFiles) {
  const imports = importSpecifiers(file)
  if (imports.length === 0) continue
  hasImports = true
  console.log(`### ${file}`)
  for (const specifier of imports) {
    console.log(`- ${specifier}`)
  }
  console.log("")
}
if (!hasImports) {
  console.log("- No import graph entries found for changed JS/TS files.")
  console.log("")
}

console.log("## Turbo Build Tasks")
if (turboTasks.length === 0) {
  console.log("- No Turbo dry-run tasks found.")
} else {
  for (const task of turboTasks) {
    console.log(`- ${task}`)
  }
}
console.log("")

console.log("## Suggested Verification")
if (owners.includes("@techhub/storefront")) {
  console.log("- `pnpm dev:storefront` for local rendering checks")
  console.log("- `pnpm lint` for storefront ESLint")
  console.log("- `pnpm build:storefront` before release-sensitive changes")
}
if (owners.includes("@techhub/medusa")) {
  console.log("- `pnpm dev:medusa` for backend runtime checks")
  console.log("- `pnpm test:medusa` for backend unit coverage")
  console.log("- `pnpm build:medusa` before release-sensitive changes")
}
if (owners.includes("root")) {
  console.log("- `pnpm lint` for workspace-level validation")
  console.log("- `pnpm turbo run build --dry=json` for task impact")
}
