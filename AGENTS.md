# Repository Guidance

## Project Overview

This repository is a client-side Sudoku game built with Next.js App Router,
React, TypeScript, Tailwind CSS, Zustand, lucide-react, and jsPDF. The app
renders a playable Sudoku board at `src/app/page.tsx` through
`src/components/SudokuMain.tsx`.

## Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the local Next.js development server.
- `npm run lint`: run ESLint on `src/`.
- `npm run typecheck`: TypeScript `tsc --noEmit`.
- `npm test`: node:test unit tests via tsx.
- `npm run build`: create a production Next.js build.
- `npm run start`: run the production server after a build.
- `npm run doctor`: React Doctor full scan.

## Architecture Notes

- `src/app/layout.tsx` owns the app shell, global CSS, metadata, header, and
  footer.
- `src/components/` contains memoized React UI pieces for the board, cells,
  controls, keypad, header, and footer.
- `src/store/useGameStore.ts` is the central Zustand store for puzzle state,
  notes, selected cell/number, move history, timers, conflicts, and actions.
  `persist` keeps `difficulty` and `bestTimes` in `localStorage` key
  `sodoku-storage`; TypedArray board state stays in-memory only.
- `src/utils/gameEngine.ts` is the public utility surface for grid conversion,
  validation, solved/filled checks, and candidate notes.
- `src/utils/sudokuUtils.ts` generates full Sudoku grids and removes cells for
  difficulty levels.
- `src/utils/generatePdf.ts` lazy-loads jsPDF so PDF generation does not affect
  the initial bundle.
- The flat grid representation is row-major with 81 cells. Use `toIndex` and
  `fromIndex` rather than repeating index math.

## Conventions

- Use TypeScript strict-mode patterns and the `@/*` alias for imports from
  `src`.
- Keep game state changes inside Zustand actions; avoid mutating typed arrays in
  place.
- Route puzzle edits through `_applyMove` when they need history, conflict,
  notes, stats, and completion state to stay consistent.
- Preserve public behavior unless a report records an intentional behavior
  change.
- Prefer small, verifiable fixes over broad rewrites. Keep bug fixes separate
  from package updates and cleanup.
- When changing UI controls, keep keyboard and touch behavior in sync.
- Generated artifacts such as `.next/`, `next-env.d.ts`, and
  `*.tsbuildinfo` are ignored and should not be staged.
- Keep ESLint flat-config ignores aligned with generated artifacts so quality
  gates do not scan build output.

## Quality Gates

- Run `npm run lint`, `npm run typecheck`, and `npm test` before every push when
  source or docs are changed.
- Run `npm run build` before final completion and after TypeScript, Next.js, or
  dependency changes.
- CI in `.github/workflows/ci.yml` runs lint/typecheck/test/build. Never inline
  `NEXT_PUBLIC_*` or API keys — use `${{ secrets.* }}` only; tolerate missing
  secrets; prefer deferred client init if SDKs are added later.

## Known Risk Areas

- `src/store/useGameStore.ts` is the largest shared module and mixes game
  engine orchestration, UI selection state, timers, hints, solving, and notes.
- `src/components/SudokuCell.tsx` handles focus, paste, keyboard navigation,
  highlighting, and note rendering in one component.
- Unit tests cover validation, grid conversion, and route-security (no API
  routes / server actions). Prefer adding regressions next to the module under
  test (`*.test.ts`).
