# CLAUDE.md - Sudoku Game

This file provides guidance for Claude Code when working with this codebase.

## Project Overview

A modern web-based Sudoku game with intelligent puzzle generation, real-time validation, and responsive design. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4.

**Live Demo:** https://sodokuapp.vercel.app/

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **UI:** React 19, Tailwind CSS 4
- **State:** Zustand 5 with selector hooks
- **Language:** TypeScript (strict mode)
- **Icons:** Lucide React
- **PDF Export:** jsPDF (lazy-loaded)

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server (localhost:3000, uses Turbopack)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with Header/Footer
│   ├── page.tsx            # Home page (renders SudokuMain)
│   ├── globals.css         # Global styles, Tailwind, animations
│   ├── about/page.tsx      # About page
│   ├── privacy/page.tsx    # Privacy policy
│   └── terms/page.tsx      # Terms of service
├── components/             # React components (all memoized)
│   ├── SudokuMain.tsx      # Main game container
│   ├── SudokuGrid.tsx      # 9x9 grid renderer
│   ├── SudokuCell.tsx      # Individual cell with notes support
│   ├── ControlPanel.tsx    # Game control buttons
│   ├── NumberPad.tsx       # Mobile-friendly 1-9 keypad
│   ├── Header.tsx          # Navigation header
│   └── Footer.tsx          # Footer with legal links
├── store/
│   └── useGameStore.ts     # Zustand store (all game state/actions)
├── constants/
│   └── index.ts            # Grid constants, history limits, difficulty settings
├── types/
│   └── index.ts            # TypeScript types and interfaces
├── lib/
│   └── utils.ts            # cn() for classNames, formatTime()
└── utils/
    ├── sudokuUtils.ts      # Puzzle generation (backtracking)
    ├── gameEngine.ts       # Re-exports from focused modules below
    ├── gridConversion.ts   # Index conversion, grid/flat transforms
    ├── validation.ts       # Conflict detection, solution checking
    ├── candidates.ts       # Auto-notes computation
    └── generatePdf.ts      # PDF export utility
```

## Architecture Notes

### State Management (useGameStore.ts)
- Single Zustand store manages all game state
- Uses typed arrays for performance:
  - `puzzle: Uint8Array` - Current puzzle (81 cells, row-major)
  - `notes: Uint16Array` - Pencil marks as bitmasks (bits 1-9)
  - `ruleConflicts: Uint8Array` - Live duplicate detection
- Delta-based undo history with MAX_HISTORY_SIZE limit (500 moves)
- All puzzle modifications should use `_applyMove()` to keep state consistent
- Bounds validation on all cell operations

### Grid Representation
- Flat array with row-major order: `index = row * 9 + col`
- Index conversion: `row = Math.floor(index / 9)`, `col = index % 9`
- Constants defined in `src/constants/index.ts`

### Key Store Actions
- `generateNewGame()` - Creates puzzle using backtracking algorithm
- `setCellValue(row, col, value)` - Sets cell with history tracking
- `toggleNote(row, col, value)` - Toggles candidate notes
- `autoFillNotes()` - Auto-computes all valid candidates
- `undoMove()` - Reverts last move
- `checkCompletion()` - Validates and highlights incorrect cells
- `solveGame()` - Auto-completes puzzle
- `provideHint()` - Reveals random empty cell

### Performance Patterns
- All components use `React.memo()`
- Zustand selectors with `useShallow` for grouped subscriptions
- `useCallback` for event handlers, `useMemo` for computed values
- jsPDF lazy-loaded on demand
- Timer uses direct store access to prevent re-render cascades

## Coding Conventions

- Functional components with hooks only
- Memoize components to prevent unnecessary re-renders
- Use Zustand actions for state changes (no direct mutations)
- Path alias: `@/*` maps to `./src/*`
- All game state flows through the Zustand store
- Consistent focus ring styling: `focus:ring-2 focus:ring-blue-500`
- Responsive text: use `text-sm sm:text-base` patterns

## Constants

Located in `src/constants/index.ts`:
- `GRID_SIZE = 9`
- `CELL_COUNT = 81`
- `MAX_HISTORY_SIZE = 500`
- `MAX_REMOVAL_RATIO = 0.7`
- `MIN_VISIBLE_CELLS = 20`

## Difficulty Levels

- **Easy:** 30 cells removed (51 clues)
- **Medium:** 40 cells removed (41 clues)
- **Hard:** 50 cells removed (31 clues)
