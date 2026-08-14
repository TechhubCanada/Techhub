# Storefront Next.js 16.3 Upgrade

Date: August 13, 2026

## Dependency changes

- `next`: `16.2.10` to `16.3.0`
- `eslint-config-next`: `16.2.10` to `16.3.0`
- `react` and `react-dom`: `19.2.7` to `19.2.8`

The existing React type package pins remain at `@types/react@19.2.17` and `@types/react-dom@19.2.3` because the installed Radix packages declare exact peer ranges for those versions.

## Compatibility review

The storefront already satisfies Next.js 16.3 requirements: it uses Node.js 24.14.0 locally, above Next.js 16.3's Node.js 20.9.0 minimum. No Next.js codemods or application code changes were required for this patch upgrade.

## Verification

- `pnpm install --frozen-lockfile --offline`
- `pnpm --filter @techhub/storefront exec next --version` reports `16.3.0`
- `pnpm --filter @techhub/storefront build`

The native flat-config migration loads successfully. `pnpm --filter @techhub/storefront lint` now reaches source linting but remains non-zero because of an existing duplicate `@tanstack/react-query` import in `src/lib/util/react-query.tsx`; the command also reports pre-existing warnings. This upgrade does not change that application code.
