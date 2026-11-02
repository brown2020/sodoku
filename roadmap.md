# Roadmap

## Tooling (2026-11-02)

Direct dependencies are on the latest releases. `npm run typecheck` uses TypeScript 7.0 (`@typescript/native`). The `typescript` package stays on the TypeScript 6 API (`@typescript/typescript6`) so ESLint can load it; typescript-eslint rejects TypeScript 7.0 until a compiler API ships. `minimatch` is overridden to `^11.0.4` (GHSA-g3hv-75wg-m249). CI and local verification use Node.js 24.

Not implemented. Notes from the QA click-through after Check was enabled during play.

## Check feedback mid-game

When Check runs before the grid is full and every filled cell matches the solution, show a visible “no errors so far” message. Today Check only highlights wrong cells, so a correct partial board looks like the click did nothing.

## Completion message after the puzzle is solved

Show a completion message when the board is finished, including when the player uses Solve.

Check should stay disabled after Solve. Solve writes the solution and marks the game complete, so Check cannot find a mistake. Leaving it enabled would either do nothing or risk treating a revealed grid as a player win and a best time. The Solve message should say the puzzle was filled by Solve, separate from the win dialog for a puzzle the player completed.
