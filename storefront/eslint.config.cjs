const nextConfig = require("eslint-config-next/core-web-vitals")
const prettierConfig = require("eslint-config-prettier")
const nextBaseConfig = nextConfig.find((config) => config.name === "next")
const nextTypeScriptConfig = nextConfig.find(
  (config) => config.name === "next/typescript"
)

module.exports = [
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "coverage/",
      "public/",
      "e2e/",
      "integration-tests/",
      "**/*.d.ts",
      ".env",
      ".env.local",
      ".env.*.local",
      ".eslintcache",
      "pnpm-lock.yaml",
    ],
  },
  ...nextConfig,
  prettierConfig,
  {
    plugins: {
      react: nextBaseConfig.plugins.react,
      "react-hooks": nextBaseConfig.plugins["react-hooks"],
      "@next/next": nextBaseConfig.plugins["@next/next"],
      "@typescript-eslint": nextTypeScriptConfig.plugins["@typescript-eslint"],
    },
    rules: {
      // General best practices
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info"],
        },
      ],
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "warn",
      "object-shorthand": "warn",
      eqeqeq: ["error", "always"],

      // React best practices
      "react/no-unescaped-entities": "warn",
      "react/self-closing-comp": "error",
      "react/prefer-es6-class": "error",
      "react/no-array-index-key": "warn",
      "react/no-danger": "warn",

      // React hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // Preserve the prior lint policy while the React Compiler rule is adopted.
      "react-hooks/set-state-in-effect": "off",

      // Next.js
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "error",
    },
  },
  // Override for config files that legitimately use require()
  {
    files: ["**/*.config.js", "**/*.config.cjs", "check-env-variables.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
]
