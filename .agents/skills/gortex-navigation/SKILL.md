---
name: gortex-navigation
description: Use when navigating, reading, editing, reviewing impact, or debugging Gortex tool visibility in this repository.
---

# Gortex Navigation

Gortex is the primary navigation and impact-analysis system for this repository. Use it before shell-only file reads, text search, or ad hoc dependency tracing.

## Workflow

1. Start broad repository work with `smart_context`.
2. If a Gortex tool is not visible, call `tools_search` to promote deferred schemas before assuming the tool is unavailable.
3. Use current tool names:
   - `winnow_symbols` or `graph_completion_search` for symbol discovery.
   - `get_file_summary` for file role summaries.
   - `batch_symbols` for symbol source, callers, and callees.
   - `find_usages` or `check_references` for references.
   - `get_edit_plan` before coordinated multi-file edits.
   - `edit_file`, `batch_edit`, or `write_file` for graph-aware writes.
4. If MCP is unavailable, use the Gortex CLI (`gortex context`, `gortex tools search`, `gortex daemon status`) before falling back to shell-only navigation.
5. If Gortex is unavailable or not responding, run `pnpm review:graph` and use that output as the backup navigation map.

Do not treat legacy startup guidance that names absent tools as proof that the daemon failed; verify with `index_health`, `gortex daemon status`, and `tools_search` first.
