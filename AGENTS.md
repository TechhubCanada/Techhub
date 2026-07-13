# Repository Guidelines

## Project Structure & Module Organization

This repository contains a Tech Hub Canada ecommerce redesign with a Medusa 2 backend and Next.js storefront. Backend code lives in `medusa/src`: API routes in `api`, modules in `modules`, workflows in `workflows`, and scripts in `scripts`. Integration tests are in `medusa/integration-tests`. Frontend code lives in `storefront/src`: routes in `app`, UI in `components`, features in `modules`, helpers in `lib`, and Playwright tests in `storefront/e2e`. Shared media is in `media/`.

## Build, Test, and Development Commands

Use `pnpm` as the root package manager. Run workspace commands from the repository root through Turborepo.

- `corepack enable`: enable package-manager shims.
- `sudo apt-get update && sudo apt-get install -y ripgrep`: install `rg` when it is missing in fresh Ubuntu/Codespaces environments.
- `cd medusa && docker compose up -d`: start local backend services.
- `pnpm install`: install all workspace dependencies.
- `pnpm dev`: run backend and storefront development tasks through Turbo.
- `pnpm dev:medusa`: run the backend on port 9000.
- `pnpm dev:storefront`: run the storefront on port 8000.
- `pnpm build`: build all workspace packages through Turbo.
- `pnpm lint`: run workspace lint tasks through Turbo.
- `pnpm test:medusa`: run Medusa unit tests.
- `pnpm test:e2e`: run Playwright tests.
- `pnpm review:graph`: print the local code review graph fallback.

## Coding Style & Naming Conventions

Use TypeScript throughout. Follow existing Next.js and Medusa patterns before adding abstractions. Storefront formatting is Prettier-based: 2 spaces, double quotes, no semicolons, trailing commas, and `arrowParens: "always"`. ESLint enforces hooks rules, strict equality, no duplicate imports, `prefer-const`, and no `debugger`. Use kebab-case for route folders and PascalCase for React components.

## Brand Voice

Use **TechHub** for customer-facing website copy, navigation, metadata, email templates, and UI text. Use **Tech Hub Canada** only when referring to the legal/company context, source project name, legacy documentation, or domain/business listing context that explicitly requires the longer name.

## Testing Guidelines

Backend tests use Jest. Unit tests match `medusa/src/**/__tests__/**/*.unit.spec.ts`; module integration tests belong under `src/modules/*/__tests__`; HTTP specs belong in `medusa/integration-tests/http/*.spec.ts`. Storefront E2E tests use Playwright under `storefront/e2e/tests`, grouped by `public` and `authenticated` flows. Run focused tests before opening a PR.

## Commit & Pull Request Guidelines

The Git history only contains an initial commit, so use concise imperative subjects such as `Add product filter tests`. PRs should describe the change, list tests run, link issues, and include screenshots or recordings for storefront UI changes.

## Agent-Specific Instructions

Gortex is the mandatory main code navigation and impact-analysis system. Use Gortex first for broad file reads, edits, symbol search, summaries, callers, dependency context, and code review impact checks; do not bypass it when it is available. Prefer Gortex MCP tools when they are available; use `tools_search` to promote deferred Gortex schemas when a named tool is not initially visible. Start broad work with `smart_context`; use `winnow_symbols` or `graph_completion_search` for symbol discovery, `batch_symbols` for source plus caller/callee context, `find_usages` or `check_references` for references, `get_edit_plan` for multi-file edit impact, and `edit_file`/`batch_edit` for graph-aware writes. Otherwise use the Gortex CLI, such as `gortex context`, `gortex query`, `gortex wakeup`, or `gortex review`, before falling back to shell-only navigation. The local code review graph is only a backup when Gortex is unavailable or not responding. In that fallback case, do not fall back to only reading package scripts; run `pnpm review:graph` and use its output as the backup navigation map: changed files, impacted workspaces, package scripts, imports from changed source files, Turbo build tasks, and suggested verification. Then use local tools such as `git diff`, `git status --short`, `find`, `grep`, `pnpm turbo run build --dry=json`, and focused file reads to continue. Agent Browser (`agent-browser`) is the preferred browser automation path. If a direct `agent-browser` tool namespace is exposed, use it; otherwise use the `agent-browser` CLI (`agent-browser skills get core --full`, then `agent-browser open`, `agent-browser snapshot`, `agent-browser screenshot`, and related commands). Fall back to installed Playwright/browser skills or Playwright CLI only when `agent-browser` is missing, failing, or the task explicitly requires Playwright test execution, and report the fallback used. Use installed Medusa skills for backend, storefront, migration, and Medusa Cloud work; source guidance comes from https://docs.medusajs.com/learn/introduction/build-with-llms-ai/agentic-skills. For storefront UI changes, use `agent-browser` at `http://localhost:8000` to confirm rendering, interactions, and screenshots; use Playwright only under the fallback rule above. Use `pnpm` in examples and automation. All agents must use `.agents/skills/documenting-changes` before finalizing repository changes; update the relevant README, the root README `Documentation version:`, docs under `docs/`, and reusable skills whenever the change affects code, configuration, workflow, dependencies, user-visible behavior, or agent behavior.

Do not start, stop, restart, or kill backend, storefront, database, or tunnel/dev server processes unless the user explicitly asks for that action in the current turn. If verification would normally require a server lifecycle change, report the required command and wait for permission.

Codex should keep this workspace trusted and configured with Gortex enabled. The expected local Codex baseline is `model_provider = 'g0i'`, `model = 'gpt-5.5'`, `model_context_window = 1050000`, `model_auto_compact_token_limit = 525000`, and `model_catalog_json = '/home/codespace/.codex/model-catalogs/g0i-gpt55-1m.json'`. The expected `g0i` provider resilience settings are `request_max_retries = 12`, `stream_max_retries = 16`, and `stream_idle_timeout_ms = 3600000`; keep these high enough for long Codex responses that may reconnect before `response.completed`. The compact threshold is 50% of the 1.05M context window, and the model catalog override makes Codex status/debug views report the same 1.05M effective window.

## Security & Configuration Tips

Do not commit secrets. Keep real `.env*` files ignored by Git; do not remove env patterns from `.gitignore`. Copy `medusa/.env.template` to `medusa/.env` and `storefront/.env.template` to `storefront/.env.local`. Keep payment, search, email, database, JWT, cookie, and `G0I_API_KEY` credentials in environment files only. Codex expects `G0I_API_KEY` from `~/.config/secrets/g0i.env`; keep guarded `set -a` source blocks in both `~/.profile` and `~/.bashrc`, verify with `${G0I_API_KEY:+SET}`, and never print the value.

<!-- gortex:communities:start -->
<!-- gortex:skills:start -->

## Community Skills

| Area                             | Description | Skill                                      |
| -------------------------------- | ----------- | ------------------------------------------ |
| Components 13 Dirs               | 226 symbols | `/gortex-components-13-dirs`               |
| Medusa Types 1 Dirs              | 155 symbols | `/gortex-medusa-types-1-dirs`              |
| Components 38 Dirs               | 143 symbols | `/gortex-components-38-dirs`               |
| Modules Fashion 8 Dirs           | 105 symbols | `/gortex-modules-fashion-8-dirs`           |
| Components Ui 15 Dirs            | 91 symbols  | `/gortex-components-ui-15-dirs`            |
| E2e Fixtures Checkoutpage        | 91 symbols  | `/gortex-e2e-fixtures-checkoutpage`        |
| Components Icons 9 Dirs          | 86 symbols  | `/gortex-components-icons-9-dirs`          |
| Workflows 6 Dirs                 | 85 symbols  | `/gortex-workflows-6-dirs`                 |
| Account Components 9 Dirs        | 70 symbols  | `/gortex-account-components-9-dirs`        |
| Fixtures Account Profilepage     | 62 symbols  | `/gortex-fixtures-account-profilepage`     |
| Lib Data 3 Dirs Getauthheaders   | 59 symbols  | `/gortex-lib-data-3-dirs-getauthheaders`   |
| E2e Fixtures Cartpage            | 43 symbols  | `/gortex-e2e-fixtures-cartpage`            |
| Hooks 1 Dirs Onsuccess           | 41 symbols  | `/gortex-hooks-1-dirs-onsuccess`           |
| Hooks 2 Dirs Stripepaymentbutton | 39 symbols  | `/gortex-hooks-2-dirs-stripepaymentbutton` |
| E2e Fixtures Orderpage           | 36 symbols  | `/gortex-e2e-fixtures-orderpage`           |
| Components Icons 3 Dirs          | 35 symbols  | `/gortex-components-icons-3-dirs`          |
| Lib Data 2 Dirs                  | 34 symbols  | `/gortex-lib-data-2-dirs`                  |
| Lib Data 6 Dirs                  | 31 symbols  | `/gortex-lib-data-6-dirs`                  |
| Fixtures Account Addressmodal    | 31 symbols  | `/gortex-fixtures-account-addressmodal`    |
| Fixtures Account Orderpage       | 31 symbols  | `/gortex-fixtures-account-orderpage`       |

<!-- gortex:skills:end -->

<!-- gortex:communities:end -->
