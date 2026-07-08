# Agent Change Documentation Policy

All agents working in this repository must keep project documentation, version markers, and reusable agent workflows in sync with their changes.

## Required Updates

For every intentional repository change, agents must check whether these files need updates:

- `README.md`: update the documentation version marker and repo-wide setup, command, dependency, or workflow notes.
- Nearest scoped README: update `medusa/README.md`, `storefront/README.md`, or the closest package/subsystem README when the change is local to that area.
- `docs/`: add or update a focused document for non-trivial behavior, architecture, operations, policies, or multi-step workflows.
- `.agents/skills/`: add or update a skill when the change creates reusable agent procedure or changes expectations for all agents.
- `AGENTS.md`: update when agent operating rules change.

## Version Marker

The root README has a `Documentation version:` line. Agents must update it whenever a change affects behavior, setup, commands, dependencies, workflow, docs policy, or agent behavior. Use a date-based value such as `2026.07.08` unless the user requests a different version scheme.

Do not bump application/package `package.json` versions just because the README documentation version changed. Package version bumps should follow release intent or explicit user instruction.

## Final Response Requirement

When finishing work, agents must say which README, version marker, doc, or skill files were updated. If no documentation update was needed, they must state that explicitly and give the reason.
