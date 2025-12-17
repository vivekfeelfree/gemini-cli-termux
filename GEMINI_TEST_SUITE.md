# 🧪 Gemini CLI Termux Test Suite (v0.22.3-termux)

**Goal**: Validate the Termux build without native deps
(node-pty/keytar/tree-sitter). Run from a clean shell on Termux ARM64.

## 0. Prep

- Create workspace:
  `rm -rf ~/gemini-test && mkdir ~/gemini-test && cd ~/gemini-test`

## 1. Version & Env

1.1 `gemini --version` → shows `0.22.3-termux` 1.2 `node -v`, `uname -m`,
`echo $PREFIX` (expect Termux paths / aarch64)

## 2. CLI Basics

2.1 `gemini --help` exits 0

## 3. Hooks (Skipped)

_Feature not currently available in this build._

## 4. Extensions

4.1 `gemini extensions list` succeeds (even if empty) 4.2
`gemini extensions settings` prints settings schema

## 5. MCP

5.1 `gemini mcp list` works (empty ok) 5.2 `gemini mcp add --help` exits 0

## 6. Non-interactive

6.1 `gemini -o json "echo hello"` returns JSON stream 6.2
`GEMINI_JSONL=1 gemini -o json "pwd"` produces JSONL lines

## 7. File ops (Termux safe)

7.1 `echo hi > file.txt` then `gemini -o json "read file.txt"` contains "hi" 7.2
`gemini -o json "ls"` lists current dir

## 8. Termux specifics

8.1 `termux-info` runs (or prints not available) without crash 8.2
`which termux-open-url` exists 8.3 `echo $LD_LIBRARY_PATH` preserved inside
`node -e "console.log(process.env.LD_LIBRARY_PATH)"`

## 9. Package/binary

9.1 `ls $(npm root -g)/@mmmbuto/gemini-cli-termux/bundle/gemini.js` exists 9.2
`node bundle/gemini.js --version` (from repo) prints 0.22.3-termux

## 10. Known limits (assert graceful handling)

10.1 `node-pty` optional: running `require('node-pty')` should fail gracefully
(not crash CLI)

## 11. Termux-API Integration (New v0.22.1)

11.1 **Detection**:
`node -e "console.log(require('./packages/core/dist/utils/termux-detect.js').isTermux())"`
returns `true`

11.2 **Tool Discovery**:

- Run `bash scripts/termux-tools/discovery.sh`
- Expect JSON array with tools like `termux_battery_status`

  11.3 **Tool Call**:

- Run `echo '{}' | bash scripts/termux-tools/call.sh termux_battery_status`
- Expect JSON output or valid Termux-API response

  11.4 **Installation Helpers**:

- `make termux-install` runs without error
- `scripts/termux-setup.sh` completes successfully

## 12. Context Memory (New v0.22.3)

12.1 **Bootstrap from GEMINI.md**  
Create `~/.gemini/GEMINI.md` with a short line, delete
`~/.gemini/context_memory/user.json`, run `gemini --version` (or start session)
→ verify `user.json` created with that line mirrored.

12.2 **Autoload toggles**  
In `/settings`, ensure `Context Memory` options show enabled, primary =
`GEMINI.md`, and auto-load flags all true. Toggle `Auto-load JSON Base` off,
restart CLI → `memory` summary should omit `base.json` path.

12.3 **Journal mirror**  
Run `/save_memory "remember this fact"` in interactive mode → check
`~/.gemini/context_memory/user.journal.jsonl` appended with one record;
`user.json` remains compact (≤200 entries).

12.4 **Primary ordering**  
Set primary to `JSON User`, restart, run `/memory` → JSON user block appears
before GEMINI.md in the displayed context list.

12.5 **Read-only base**  
Attempt to edit `base.json` via `/save_memory` (should not write); confirm file
unchanged, warning logged.

## Expected Outcome

- All steps run without crash; informational steps may show empty lists.
- No build commands required; native optional deps may fail to build but CLI
  must still work.
