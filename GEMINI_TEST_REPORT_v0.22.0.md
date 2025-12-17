# 🧪 Gemini CLI Termux Test Report (v0.22.0-termux)

**Date:** 2025-12-17 **Device:** Android (aarch64) **Node Version:** v24.11.1
**CLI Version:** 0.22.0-termux

## Test Results

| ID  | Test Suite       | Result   | Notes                                                                |
| :-- | :--------------- | :------- | :------------------------------------------------------------------- |
| 0   | Prep             | **PASS** | Workspace created.                                                   |
| 1   | Version & Env    | **PASS** | Correct version and Termux environment detected.                     |
| 2   | CLI Basics       | **PASS** | Help command exits successfully.                                     |
| 3   | Hooks            | **SKIP** | Feature not available.                                               |
| 4   | Extensions       | **PASS** | List works. Settings command displays help/schema (requires args).   |
| 5   | MCP              | **PASS** | MCP list shows connected servers. Add help command works.            |
| 6   | Non-interactive  | **PASS** | JSON and JSONL output modes function correctly.                      |
| 7   | File ops         | **PASS** | Read/Write operations successful in Termux environment.              |
| 8   | Termux specifics | **PASS** | `termux-info` runs. `LD_LIBRARY_PATH` is preserved.                  |
| 9   | Package/binary   | **PASS** | Bundle located and executes directly.                                |
| 10  | Known limits     | **PASS** | `node-pty` not found (expected), CLI operates gracefully without it. |

## Detailed Observations

- **Version:** Confirmed `0.22.0-termux` output from `--version`.
- **Extensions:** `gemini extensions settings` without arguments returns an exit
  code of 1 and prints usage info, effectively showing the schema/commands
  available.
- **MCP:** The `memory` MCP server is configured and connected.
- **Native Dependencies:** `node-pty` is confirmed missing (`MODULE_NOT_FOUND`),
  but this does not hinder core CLI functionality.
- **Patches:** Verified presence of:
  - Clipboardy patch (esbuild banner)
  - PTY fallback patch (core utils)
  - Hide Banner patch (AppContainer.tsx)

## Conclusion

The Gemini CLI v0.22.0-termux functions correctly on this Android/Termux
environment, passing all critical compatibility and functionality tests defined
in the test suite.
