# Architecture

## Map

```
Browser
  └─ Next.js App Router (static /, /about, /privacy, /terms)
       └─ page.tsx → SudokuMain (client)
            ├─ SudokuGrid / SudokuCell / ControlPanel / NumberPad / WinModal
            ├─ useGameStore (Zustand + persist)
            └─ localStorage: sodoku-storage (difficulty, bestTimes)
```

## Authority per write

| Path | Fact | Writer | Cache / durability |
| --- | --- | --- | --- |
| start_new_game | puzzle, solution, notes, stats | `generateNewGame` | in-memory |
| set_difficulty | difficulty (+ new puzzle) | `setDifficulty` | localStorage (difficulty) |
| enter_digit | puzzle[cell], history, conflicts | `setCellValue` / `inputNumber` | in-memory |
| toggle_notes | notes[cell] | `toggleNote` / Notes mode | in-memory |
| persist_prefs | difficulty, bestTimes | zustand `persist` partialize | localStorage only |

No server cache. Reload restores difficulty and best times; live board state is regenerated on first empty mount.

## Server / client

All interactive gameplay is client (`"use client"`). `/about`, `/privacy`, `/terms` are Server Component pages. No route handlers or server actions. Unauthorized `/api/*` returns Next 404 — there is no privileged mutation surface.

## Change exercises

1. **Data:** change `DIFFICULTY_SETTINGS` in `src/types/index.ts` — clue removal counts change; UI labels unchanged.
2. **Access:** adding a future `/api/scores` would require a new route file and explicit auth; today access is "everyone mutates local state; nobody mutates server state" proven by absent routes + 404.
