# Sudoku (sodoku)

A browser-based Sudoku game: generate puzzles at easy/medium/hard difficulty, enter digits with keyboard or number pad, use pencil-mark notes, hints, undo, auto-check, and export the board to PDF. Gameplay is fully client-side; difficulty preference and best times persist in `localStorage`.

**Live demo:** [https://sodokuapp.vercel.app](https://sodokuapp.vercel.app/)

## Features

- **Puzzle generation** — backtracking solver builds a full grid, then removes cells by difficulty while aiming for a unique solution
- **Difficulties** — easy (30 cells removed / ~51 clues), medium (40 / ~41), hard (50 / ~31)
- **Play controls** — cell selection, digit entry, erase, arrow-key navigation, on-screen number pad
- **Notes (pencil marks)** — toggle notes mode; optional auto-fill that recomputes candidates
- **Validation** — rule-conflict highlighting; optional auto-check for incorrect entries; check / solve actions
- **Hints & undo** — request a hint from the solution; undo recent moves (history capped)
- **Number highlighting** — select a digit to highlight matching cells
- **Best times** — tracked per difficulty in persisted Zustand state
- **PDF export** — download the current puzzle via jsPDF
- **Info pages** — `/about`, `/privacy`, `/terms`

No authentication, Firebase, payments, or server APIs — interactive play runs entirely in the browser.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js `^16.3.6` (App Router) |
| UI | React `^19.3.0`, Tailwind CSS `^4.3.3`, Lucide icons, `clsx` / `tailwind-merge` |
| Language | TypeScript `^6` |
| State | Zustand `^5` with `persist` (difficulty + best times) |
| PDF | jsPDF `^4` |
| Tests | Node.js built-in test runner via `tsx` |
| Lint | ESLint `^10` + TypeScript ESLint |

## Project structure

```
src/
  app/              # /, /about, /privacy, /terms
  components/       # SudokuMain, grid, cells, controls, number pad, chrome
  store/            # useGameStore (Zustand)
  utils/            # generation, validation, candidates, PDF, conversion
  lib/              # small shared helpers (cn, etc.)
  constants/        # shared constants
  types/            # Difficulty, game state/action types
public/             # static assets (e.g. screenshot)
docs/               # architecture / budget notes
.github/workflows/ci.yml
```

## Getting started

### Prerequisites

- Node.js 22+
- npm

### Clone and install

```bash
git clone https://github.com/brown2020/sodoku.git
cd sodoku
npm install
```

### Environment variables

None required. The app does not read custom `process.env` values for runtime features (only `NODE_ENV` in the error boundary).

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint on `src/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Node test runner over `src/**/*.test.ts` |
| `npm run doctor` | `react-doctor` check |

## Testing and CI

CI (`.github/workflows/ci.yml`) on pushes/PRs to `dev` and `main`:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`
5. `npm run build`

Tests cover grid conversion, route helpers, and validation utilities. Broader game-engine behavior is exercised mainly through the UI and lint/build gates.

## Deployment

Deployed to Vercel at [sodokuapp.vercel.app](https://sodokuapp.vercel.app/). No secrets are required for a production build of this client-only app.

## Contributing

1. Work on `dev`.
2. Run `npm run lint`, `npm run typecheck`, and `npm test` before pushing.
3. Keep gameplay logic in `src/utils` / `src/store` rather than bloating components when possible.

## License

No `LICENSE` file is present in this repository.
