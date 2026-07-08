# Gortex Agent Workflow

Use Gortex as the first navigation and impact-analysis system for this repository. A healthy setup can still hide many Gortex schemas at session start because Codex and Gortex use deferred tool discovery.

## Startup Checks

- Confirm Gortex is connected with `index_health` or `gortex daemon status` when tool availability looks suspicious.
- Use `tools_search` to promote deferred Gortex schemas before assuming a tool is missing.
- Treat `smart_context`, `get_file_summary`, `diff_context`, and `edit_file` as the core eager tools in a fresh session.

## Current Tool Names

- Task context: `smart_context`.
- Symbol discovery: `winnow_symbols` or `graph_completion_search`.
- Source, callers, and callees for known symbols: `batch_symbols`.
- References and usage checks: `find_usages` or `check_references`.
- Multi-file edit ordering: `get_edit_plan`.
- Graph-aware writes: `edit_file`, `batch_edit`, or `write_file`.

If the MCP server is unavailable or unresponsive, use the Gortex CLI before falling back to shell-only navigation. If both MCP and CLI fail, run `pnpm review:graph` as the repository backup map.
