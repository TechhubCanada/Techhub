---
name: documenting-changes
description: Use when modifying repository code, configuration, documentation, tests, scripts, workflows, dependencies, agent instructions, README files, versions, or other tracked project artifacts.
---

# Documenting Changes

## Overview

Every repository change must leave the project documentation accurate. Treat README, version markers, policy docs, and agent skills as part of the change, not follow-up cleanup.

## Required Workflow

Before finishing any change:

1. Identify the user-visible, operator-visible, developer-visible, and agent-visible impact.
2. Update the nearest relevant README for the changed area. Use root `README.md` for repo-wide policy, setup, command, dependency, or cross-app changes.
3. Update the README documentation version marker when the change affects behavior, setup, commands, dependencies, workflow, docs policy, or agent behavior.
4. Create or update a document under `docs/` for non-trivial behavior, operational policy, architectural decisions, workflow rules, or multi-step procedures.
5. Update or create a skill in `.agents/skills/` when the change creates a reusable agent workflow or changes how all agents should work.
6. In the final response, state which README/version/doc/skill files changed, or explicitly state why no doc update was needed.

## README Selection

| Change scope | README to check |
| --- | --- |
| Repo policy, root commands, dependencies, agent rules | `README.md` |
| Backend setup, Medusa modules, API, workflows, scripts | `medusa/README.md` or nearest `medusa/src/**/README.md` |
| Storefront setup, UX, routes, components, E2E | `storefront/README.md` or nearest storefront README |
| Tests only | nearest test README, plus root README if commands changed |
| Agent workflow | `AGENTS.md`, root `README.md`, and `.agents/skills/` |

## Version Rule

Update the root README `Documentation version:` line for any intentional repository change unless the change is purely temporary or explicitly not meant to be documented. If package release semantics are affected, also update the relevant `package.json` version only when the user asks for a release/version bump or the repository policy requires one.

## Common Mistakes

- Do not finish with only code changes when behavior or workflow changed.
- Do not update package versions just to satisfy the README documentation version rule.
- Do not create a new doc for a one-line typo fix unless the user asked for strict documentation traceability.
- Do not create one-off skills for project-specific facts that belong in `AGENTS.md` or `docs/`.
