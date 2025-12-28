# Context Memory (Termux fork)

This fork uses two complementary memory sources:

- **GEMINI.md files** (global `~/.gemini/GEMINI.md` + workspace files). Best for
  human-written guidelines and project rules.
- **JSON context memory** (`~/.gemini/context_memory/`). Best for structured
  facts with keys, scopes, and expiry.

## Memory Mode (recommended)

Set this once in `/settings → Memory → Memory Mode`:

- **default**: GEMINI.md + JSON (JIT off)
- **jit**: GEMINI.md only (JIT on, JSON off)
- **jit+json**: GEMINI.md + JSON with JIT loading

When Memory Mode is set, it controls whether JSON memory is loaded. The
per-source options below still apply (auto-load, primary, base writes).

You can also set it in `settings.json`:

```json
{
  "memory": {
    "mode": "jit+json"
  }
}
```

## Context Memory (JSON) settings

Location: `/settings → Memory → Context Memory`

- **Enable Context Memory**: master toggle for JSON memory.
- **Primary Memory**: ordering among `GEMINI.md`, `JSON Base`, `JSON User`.
- **Auto-load**: per-source autoload at session start.
- **Allow Base Memory Writes**: OFF by default. Enables writes to `base.json`.
- **MCP Import**: optional import into JSON memory (base/user).

## How saving works

- `/memory add <text>` writes to GEMINI.md and mirrors into JSON.
- `/save_memory {"fact":"..."}` also mirrors into JSON.
- Writes to `base.json` require **Allow Base Memory Writes**.

## JSON files

Stored at `~/.gemini/context_memory/`:

- `base.json` (read-mostly): stable facts.
- `user.json` (snapshot): compact state regenerated from the journal.
- `user.journal.jsonl` (append-only): every save appends here; compaction
  processes only new bytes.

Bootstrap: if `user.json` is missing and `GEMINI.md` exists, the CLI seeds a
bootstrap entry into `user.json` on first load.

## Storage notes

- Dir `~/.gemini/context_memory` is created 0700; files 0600.
- Snapshot limits: 50 entries, ~20KB; journal rotation at ~2MB.
- Keyless entries are accepted only if `expiresAt` is set or `tags` include
  `ephemeral`.

## Practical tip

Avoid duplication by keeping **long instructions** in GEMINI.md and **atomic
facts** (preferences, IDs, shortcuts) in JSON memory.
