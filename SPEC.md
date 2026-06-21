# Sudoku Current-State Specification

## Purpose

The project is a browser-based Sudoku game. It lets a player generate a puzzle,
enter numbers, use notes, request hints, check a solution, solve the puzzle, and
export the current puzzle to PDF.

## Current Product Behavior

- The home route renders the playable Sudoku board.
- Difficulty levels are `easy`, `medium`, and `hard`.
- New games generate a complete Sudoku grid, remove a difficulty-specific
  number of cells, and store both the puzzle and solution in the Zustand store.
- Players can select cells, type digits, use the on-screen number pad, erase
  entries, toggle notes mode, auto-fill notes, toggle auto-check, undo moves,
  request hints, check completion, solve the game, and download a PDF.
- Keyboard arrow navigation moves between cells.
- The app includes About, Privacy, and Terms routes plus shared header/footer
  navigation.

## Architecture Summary

- Next.js App Router files live under `src/app`.
- React components live under `src/components`.
- Game state and actions are centralized in `src/store/useGameStore.ts`.
- Core grid, validation, candidate, and conversion helpers live under
  `src/utils`.
- Shared constants live in `src/constants/index.ts`.
- Shared TypeScript types live in `src/types/index.ts`.

## Validation

- Current project scripts are `npm run lint`, `npm run build`,
  `npm run dev`, and `npm run start`.
- There is no dedicated unit, integration, or browser test script in
  `package.json`.
- The codebase improvement pass uses lint and build as the primary local gates.

## Quality Risks

- Puzzle generation does not currently prove that removed-cell puzzles have a
  unique solution. This can create ambiguous puzzles even though each generated
  full grid is valid.
- README dependency tables are stale relative to `package.json`.
- The Zustand store remains a broad ownership point for game logic and UI state.
- No automated tests protect Sudoku solving, candidate-note, undo, hint, or
  conflict behavior.

## Improvement Scope For This Pass

This codebase-improvement pass may update current implementation notes, fix
confirmed bugs, improve validation, narrow code ownership, and remove or defer
evidence-backed dead code or dependency issues. It must not create product
roadmap priorities beyond documenting current-state findings and deferred
technical follow-up.
