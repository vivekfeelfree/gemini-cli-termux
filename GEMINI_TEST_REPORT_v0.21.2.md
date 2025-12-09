# 🧪 Gemini CLI Termux - Test Report v0.21.2-termux

**Platform**: Android 12 / Termux (aarch64) **Node**: 24.9.0 **Version Tested**:
0.21.2-termux **Package name**: @mmmbuto/gemini-cli-termux

## Summary

- Build pipeline: `npm install --ignore-optional --ignore-scripts` →
  `npm run build` → `npm run bundle` (success)
- Version checks:
  - `node bundle/gemini.js --version` → 0.21.2-termux ✅
- Packaging: bundle/ generated with policies/assets copied ✅
- Optional native deps (keytar, node-pty, tree-sitter) skipped via
  `--ignore-optional --ignore-scripts`; build completes without them. ⚠️ (same
  approach as previous Termux releases)
- Tests: full `npm run preflight` not run (native deps not available on Termux);
  no automated test suite executed. ⚠️

## Notes

- NPM package name updated to `@mmmbuto/gemini-cli-termux` for publish.
- Sandbox image config unchanged (0.21.0-nightly.20251202.2d935b379).
- Recommend CI verification on x86_64 before upstream/nightly promotion.
