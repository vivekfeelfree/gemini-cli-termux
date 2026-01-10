# Upstream 0.24.9 Features - Termux Integration

**Date**: 2026-01-10  
**Upstream Base**: google-gemini/gemini-cli@main  
**Termux Version**: v0.24.9-termux

---

## Overview

This document summarizes the new upstream features integrated in v0.24.9-termux
and their compatibility with Termux. All features have been tested and verified
to work correctly on Android/Termux.

---

## New Features

### 1. Built-in Agent Skills

**Commit**: `461c277bf`  
**Location**: `packages/core/src/skills/`, `packages/cli/src/commands/skills/`

**Description**:

- Native skills system built into the CLI
- Skills can be loaded, enabled, disabled, and listed
- Skills extend agent capabilities with specialized knowledge
- Similar to extensions but built into the core

**Termux Compatibility**: ✅ Fully Compatible

**Usage**:

```bash
# List available skills
gemini /skills list

# Enable a skill
gemini /skills enable <skill-name>

# Disable a skill
gemini /skills disable <skill-name>
```

**Notes**:

- Skills are stored in `.gemini/skills/` directory
- Format is similar to extensions with `SKILL.md` metadata
- Works correctly with Termux filesystem
- No additional dependencies required

---

### 2. Tool Modifier System

**Commit**: `packages/core/src/scheduler/tool-modifier.ts` (new)  
**Location**: `packages/core/src/scheduler/tool-modifier.ts` + tests

**Description**:

- New system for modifying tool calls before execution
- Allows for tool call preprocessing, validation, and transformation
- Can add, remove, or modify tool arguments
- Useful for security, policy enforcement, and UX improvements

**Termux Compatibility**: ✅ Fully Compatible

**Technical Details**:

- Event-based architecture with tool modification hooks
- Works with all existing tools (shell, edit, mcp, etc.)
- No performance impact on Termux
- Tested with shell tool and memory tools

---

### 3. File Diff Utilities

**Commit**: `packages/core/src/utils/fileDiffUtils.ts` (new)  
**Location**: `packages/core/src/utils/fileDiffUtils.ts` + tests

**Description**:

- New utility for comparing file contents
- Generates unified diff format
- Used by edit tool and other file operations
- Better error messages for file changes

**Termux Compatibility**: ✅ Fully Compatible

**Features**:

- Unified diff format (standard patch format)
- Line-by-line comparison
- Efficient implementation (no heavy dependencies)
- Works with large files

**Usage** (internal):

```typescript
import { getFileDiff, applyFileDiff } from '@google/gemini-cli-core';

const diff = getFileDiff(oldContent, newContent, 'file.ts');
console.log(diff); // unified diff format
```

---

### 4. Enhanced Settings Management

**Commits**: Multiple in `packages/cli/src/config/settings.ts`  
**Location**: `packages/cli/src/config/settings.ts` + tests

**Description**:

- Refactored settings system with improved validation
- New settings schema with better error messages
- Simplified migration logic (removed legacy V1 migration)
- Better type safety

**Termux Compatibility**: ✅ Fully Compatible

**Changes**:

- Settings stored in `.gemini/settings.json` (tracked in git)
- Schema validation at startup
- Clear error messages for invalid settings
- Automatic defaults for missing values

**Notes**:

- Termux-specific settings (TTS, compact UI) preserved
- No changes to mobile-first rendering
- Settings file remains compatible across versions

---

### 5. Updated Ink to v6.4.7

**Commit**: `b54e688c7`  
**Location**: `package.json` (dependencies)

**Description**:

- Updated from previous Ink version to v6.4.7
- Bug fixes and performance improvements
- Better handling of keyboard input
- Improved rendering on mobile terminals

**Termux Compatibility**: ✅ Fully Compatible

**Benefits**:

- Smoother scrolling on Termux
- Better handling of Android keyboard input
- Fixed rendering issues with wide characters
- Lower CPU usage on mobile devices

---

### 6. Hook Event Handler

**Commit**: `packages/core/src/hooks/hookEventHandler.ts` (new)  
**Location**: `packages/core/src/hooks/hookEventHandler.ts` + tests

**Description**:

- Centralized event handler for hook system
- Improved hook execution and error handling
- Better logging and debugging support
- More reliable hook triggers

**Termux Compatibility**: ✅ Fully Compatible

**Technical Details**:

- Event-based architecture
- Proper error propagation
- Detailed logging for debugging
- Works with all hook types

---

### 7. Updated System Prompts

**Commit**: `b08b0d715`  
**Location**: System prompt configuration

**Description**:

- Updated system prompts to prefer non-interactive commands
- Better handling of command execution in headless mode
- Improved agent behavior for batch processing

**Termux Compatibility**: ✅ Fully Compatible

**Impact**:

- Better performance in non-interactive mode
- Fewer prompts for automation scripts
- Improved output format for `gemini -o json`

---

### 8. Removed sessionHookTriggers

**Commit**: `356f76e54`  
**Location**: `packages/core/src/core/` (removed)

**Description**:

- Removed `sessionHookTriggers.ts` (deprecated)
- Replaced by `geminiChatHookTriggers` in gemini.tsx
- Simplified core exports

**Termux Compatibility**: ✅ Fully Compatible (no impact)

**Action Taken**:

- Updated `packages/core/src/index.ts` to remove export
- No changes required in Termux-specific code

---

## Deprecated/Removed Features

### Removed Files

| File                                               | Reason                       | Termux Impact |
| -------------------------------------------------- | ---------------------------- | ------------- |
| `docs/cli/configuration.md`                        | Consolidated into other docs | None          |
| `docs/get-started/deployment.md`                   | Outdated, no longer relevant | None          |
| `packages/cli/src/commands/extensions/settings.ts` | Replaced by `configure.ts`   | None          |
| `packages/core/src/core/sessionHookTriggers.ts`    | Deprecated, unused           | None          |
| `packages/core/src/utils/shell-permissions.ts`     | Replaced by new system       | None          |

### Migration Guide

If you were using removed features:

1. **Extension Settings** → Use `gemini /extensions configure`
2. **Session Hook Triggers** → Use `geminiChatHookTriggers` in CLI
3. **Shell Permissions** → New system handles this automatically

---

## Testing Results

### Automated Tests

All existing tests pass on Termux:

- ✅ Unit tests (TypeScript)
- ✅ Integration tests
- ✅ Hook system tests
- ✅ Tool modifier tests
- ✅ File diff tests
- ✅ Settings validation tests

### Manual Testing

Manually tested on Termux:

- ✅ Built-in Agent Skills (list, enable, disable)
- ✅ Tool modifiers (shell tool, edit tool)
- ✅ File diff utilities
- ✅ Settings management (UI, validation)
- ✅ Ink v6.4.7 rendering
- ✅ Hook event handling
- ✅ Non-interactive mode with JSON output

### Performance

No performance degradation observed on Termux:

- Startup time: ~2-3s (same as v0.24.8)
- Memory usage: ~120-150MB (same as v0.24.8)
- Response time: No noticeable difference

---

## Known Issues

None at this time. All features tested and working correctly on Termux.

---

## Future Considerations

### Potential Improvements for Termux

1. **Skills Directory Optimization**
   - Current: Skills loaded from `.gemini/skills/`
   - Future: Consider pre-bundled Termux skills

2. **Tool Modifiers for Mobile**
   - Current: Generic tool modifiers
   - Future: Add mobile-specific modifiers (e.g., battery-aware tool execution)

3. **File Diff for Mobile Screens**
   - Current: Standard unified diff
   - Future: Optimize diff output for small mobile screens

---

## Compatibility Matrix

| Feature         | v0.24.8-termux | v0.24.9-termux | Notes                 |
| --------------- | -------------- | -------------- | --------------------- |
| Built-in Skills | ❌ No          | ✅ Yes         | New upstream feature  |
| Tool Modifiers  | ❌ No          | ✅ Yes         | New upstream feature  |
| File Diff Utils | ❌ No          | ✅ Yes         | New upstream feature  |
| Ink v6.4.7      | ❌ v6.x        | ✅ v6.4.7      | Updated from upstream |
| Hook Events     | ✅ Basic       | ✅ Enhanced    | Improved upstream     |
| System Prompts  | ✅ Old         | ✅ Updated     | Updated from upstream |
| Termux Patches  | ✅ All         | ✅ All         | Preserved             |
| Context Memory  | ✅ Yes         | ✅ Yes         | Termux feature        |
| PTY (ARM64)     | ✅ Yes         | ✅ Yes         | Now in dependencies   |
| Clipboard       | ✅ Yes         | ✅ Yes         | Termux detection      |

---

## Conclusion

All upstream features from v0.24.9 are fully compatible with Termux. No breaking
changes for existing users. New features enhance the Termux experience with
better agent capabilities, improved tool handling, and smoother UI.

**Recommendation**: All Termux users should upgrade to v0.24.9-termux.

---

**Author**: DioNanos  
**Date**: 2026-01-10  
**Status**: ✅ Released and Verified
