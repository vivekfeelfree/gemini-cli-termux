# Termux Patches (0.24.1-termux)

Minimal changes to run `gemini-cli` on Android/Termux ARM64 without native deps.

## Patch List

1. **Clipboard (TERMUX\_\_PREFIX)** – On Termux set `TERMUX__PREFIX` from
   `$PREFIX` so clipboardy detects Termux correctly.
2. **Optional native modules** – Leave `node-pty`, `keytar`, `tree-sitter-bash`
   in `optionalDependencies`; build failures are tolerated.
3. **Core exports** – `packages/core/src/index.ts` re-exports stdio utilities,
   hook/telemetry APIs, Termux detectors, and context-memory helpers so CLI
   bundling succeeds on Termux.
4. **Bundle** – Prebuilt `bundle/gemini.js` shipped in npm package
   (ARM64/Android) with policy files under `bundle/policies/`.
5. **is-in-ci override** – Prevents ink from detecting Termux as CI.
6. **Punycode warning** – Suppresses deprecation warning on Android.
7. **Termux detection** – `packages/core/src/utils/termux-detect.ts` utility.
8. **Postinstall message** – Clear success message on Termux install.
9. **Context memory + Memory Mode** – JSON memories (base/user/journal) plus
   presets: `default`, `jit`, `jit+json`. Auto-load toggles, primary selector,
   and MCP import tool (disabled by default; base writes still gated).
10. **Mobile-first settings** – Compact `/settings` rendering by default on
    Termux; TTS toggle exposed (opt-in).
11. **Shell parser fix** – Base64 polyfill in bundle banner to support
    web-tree-sitter on Node 22/24 (fixes `run_shell_command`).

## New in 0.24.x

- **Memory Mode presets** and **JIT + JSON** combined memory support.
- **Settings reorg**: Memory options grouped in `/settings → Memory`; MCP import
  categories hidden.
- **Shell tool fix**: `Uint8Array.fromBase64` polyfill for web-tree-sitter.
- **Docs/tests** refreshed for current release.

## Expected Warnings

- Missing native modules may log warnings on Termux; functionality remains
  (non-PTY shell, plain token storage).

## Scope

No functional changes to upstream features; only compatibility/export fixes.

## Merge Strategy

All patches are designed to be merge-safe. See
[docs/termux-api/MERGE_STRATEGY.md](../termux-api/MERGE_STRATEGY.md) for details
on maintaining patches after upstream sync.

**Version**: 0.24.1-termux (latest)
