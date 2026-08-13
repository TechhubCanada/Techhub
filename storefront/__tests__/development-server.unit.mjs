import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const storefrontRoot = resolve(import.meta.dirname, "..")
const packageJson = JSON.parse(
  readFileSync(resolve(storefrontRoot, "package.json"), "utf8")
)
const readme = readFileSync(resolve(storefrontRoot, "README.md"), "utf8")

assert.equal(packageJson.scripts.dev, "next dev -p 8000 --webpack")
assert.equal(
  readme.includes(
    "The local storefront development command uses Webpack instead of Turbopack"
  ),
  true
)
