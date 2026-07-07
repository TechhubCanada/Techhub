# Repository Guidelines

## Project Structure & Module Organization

This repository contains a Tech Hub Canada ecommerce redesign with a Medusa 2 backend and Next.js storefront. Backend code lives in `medusa/src`: API routes in `api`, modules in `modules`, workflows in `workflows`, and scripts in `scripts`. Integration tests are in `medusa/integration-tests`. Frontend code lives in `storefront/src`: routes in `app`, UI in `components`, features in `modules`, helpers in `lib`, and Playwright tests in `storefront/e2e`. Shared media is in `media/`.

## Build, Test, and Development Commands

Use `pnpm` as the root package manager. Run workspace commands from the repository root through Turborepo.

- `corepack enable`: enable package-manager shims.
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

## Testing Guidelines

Backend tests use Jest. Unit tests match `medusa/src/**/__tests__/**/*.unit.spec.ts`; module integration tests belong under `src/modules/*/__tests__`; HTTP specs belong in `medusa/integration-tests/http/*.spec.ts`. Storefront E2E tests use Playwright under `storefront/e2e/tests`, grouped by `public` and `authenticated` flows. Run focused tests before opening a PR.

## Commit & Pull Request Guidelines

The Git history only contains an initial commit, so use concise imperative subjects such as `Add product filter tests`. PRs should describe the change, list tests run, link issues, and include screenshots or recordings for storefront UI changes.

## Agent-Specific Instructions

Gortex is the main code navigation and impact-analysis system. Use Gortex first for broad file reads, edits, symbol search, summaries, callers, dependency context, and code review impact checks. The local code review graph is only a backup when Gortex is unavailable or not responding. In that fallback case, do not fall back to only reading package scripts; run `pnpm review:graph` and use its output as the backup navigation map: changed files, impacted workspaces, package scripts, imports from changed source files, Turbo build tasks, and suggested verification. Then use local tools such as `git diff`, `git status --short`, `find`, `grep`, `pnpm turbo run build --dry=json`, and focused file reads to continue. Use installed Medusa skills for backend, storefront, migration, and Medusa Cloud work; source guidance comes from https://docs.medusajs.com/learn/introduction/build-with-llms-ai/agentic-skills. For storefront UI changes, use the Playwright/browser skills or a local browser at `http://localhost:8000` to confirm rendering, interactions, and screenshots. Use `pnpm` in examples and automation.

## Security & Configuration Tips

Do not commit secrets. Keep real `.env*` files ignored by Git; do not remove env patterns from `.gitignore`. Copy `medusa/.env.template` to `medusa/.env` and `storefront/.env.template` to `storefront/.env.local`. Keep payment, search, email, database, JWT, cookie, and `G0I_API_KEY` credentials in environment files only. Codex expects `G0I_API_KEY` from `~/.config/secrets/g0i.env`; keep guarded `set -a` source blocks in both `~/.profile` and `~/.bashrc`, verify with `${G0I_API_KEY:+SET}`, and never print the value.

<!-- gortex:communities:start -->
<!-- gortex:skills:start -->
## Community Skills

| Area | Description | Skill |
|------|-------------|-------|
| Components 12 Dirs | 220 symbols | `/gortex-components-12-dirs` |
| Components 36 Dirs | 125 symbols | `/gortex-components-36-dirs` |
| Admin Fashion 8 Dirs | 105 symbols | `/gortex-admin-fashion-8-dirs` |
| Components Icons 14 Dirs | 104 symbols | `/gortex-components-icons-14-dirs` |
| Components Ui 15 Dirs | 102 symbols | `/gortex-components-ui-15-dirs` |
| E2e Fixtures Checkoutpage | 91 symbols | `/gortex-e2e-fixtures-checkoutpage` |
| Fashion Id 2 Dirs | 74 symbols | `/gortex-fashion-id-2-dirs` |
| Account Components 9 Dirs | 70 symbols | `/gortex-account-components-9-dirs` |
| Fixtures Account Profilepage | 62 symbols | `/gortex-fixtures-account-profilepage` |
| Lib Data 3 Dirs Getauthheaders | 59 symbols | `/gortex-lib-data-3-dirs-getauthheaders` |
| E2e Fixtures Cartpage | 43 symbols | `/gortex-e2e-fixtures-cartpage` |
| Hooks 1 Dirs Onsuccess | 41 symbols | `/gortex-hooks-1-dirs-onsuccess` |
| Hooks 2 Dirs Stripepaymentbutton | 39 symbols | `/gortex-hooks-2-dirs-stripepaymentbutton` |
| E2e Fixtures Orderpage | 36 symbols | `/gortex-e2e-fixtures-orderpage` |
| Components Icons 3 Dirs | 35 symbols | `/gortex-components-icons-3-dirs` |
| Lib Data 2 Dirs Getcartid | 34 symbols | `/gortex-lib-data-2-dirs-getcartid` |
| Lib Data 1 Dirs Login | 32 symbols | `/gortex-lib-data-1-dirs-login` |
| Fixtures Account Addressmodal | 31 symbols | `/gortex-fixtures-account-addressmodal` |
| Fixtures Account Orderpage | 31 symbols | `/gortex-fixtures-account-orderpage` |
| Hooks Uselineitemquantityupdater | 30 symbols | `/gortex-hooks-uselineitemquantityupdater` |
<!-- gortex:skills:end -->

<!-- gortex:communities:end -->
