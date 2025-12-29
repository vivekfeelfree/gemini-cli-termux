# 🐛 Critical Bug: Auto-update Mechanism Broken for Fork

**Status**: Analyzed / Pending Fix **Date**: 2025-12-29 **Severity**: CRITICAL
(Data Loss/Corruption potential)

## 📝 Problem Description

The auto-update mechanism in `@mmmbuto/gemini-cli-termux` is currently broken
because it mixes dynamic version detection with hardcoded package names. When an
update is detected for the fork, the CLI attempts to install that version number
but from the original `@google/gemini-cli` package.

## 🔍 Detailed Analysis

### 1. Version Detection (Correct)

File: `packages/cli/src/ui/utils/updateCheck.ts` The code correctly reads the
local `package.json` to get the package name and version:

```typescript
const packageJson = await getPackageJson(__dirname);
const { name, version: currentVersion } = packageJson;
// name is "@mmmbuto/gemini-cli-termux"
```

It then checks NPM for the latest version of _this_ name. If it finds `0.24.2`,
it returns an update object with `latest: "0.24.2"`.

### 2. Update Command Generation (CRITICAL BUG)

File: `packages/cli/src/utils/installationInfo.ts` The update commands are
hardcoded to point to the upstream package:

```typescript
// Assuming global npm
const updateCommand = 'npm install -g @google/gemini-cli@latest';
return {
  packageManager: PackageManager.NPM,
  isGlobal: true,
  updateCommand, // <--- Hardcoded @google/gemini-cli
  // ...
};
```

### 3. Execution (The Failure)

File: `packages/cli/src/utils/handleAutoUpdate.ts` The logic combines the
hardcoded command with the detected version:

```typescript
const updateCommand = installationInfo.updateCommand.replace(
  '@latest',
  `@${info.update.latest}`,
);
// Result: "npm install -g @google/gemini-cli@0.24.2"
```

## 💥 Impact

1. **404 Errors**: If the fork version (`0.24.2`) does not exist in the upstream
   `@google/gemini-cli` repository, the update fails with a generic error.
2. **Upstream Overwrite**: If the version number happens to exist upstream, the
   CLI will **overwrite** the Termux-optimized fork with the official Google
   version, removing all Android/Termux patches and potentially breaking the
   installation.

## 🛠️ Proposed Fix

Modify `getInstallationInfo` in `packages/cli/src/utils/installationInfo.ts` to
take the package name as a parameter or read it dynamically from the root
`package.json`, ensuring the `updateCommand` uses the actual package name of the
installation.

---

_Documented by Gemini CLI Agent_
