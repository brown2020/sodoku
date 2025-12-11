# Sudoku

A modern, performant Sudoku game built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4. Features intelligent puzzle generation, real-time validation, and a beautiful responsive interface.

![Sudoku Game Screenshot](./screenshot.png)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Live Demo

**[Play Sudoku →](https://sodokuapp.vercel.app/)**

## Features

### Gameplay

- **Intelligent Puzzle Generation** - Backtracking algorithm creates valid, solvable puzzles
- **Three Difficulty Levels** - Easy (51 clues), Medium (41 clues), Hard (31 clues)
- **Real-time Conflict Detection** - Instantly highlights invalid placements
- **Number Highlighting** - Click any number to highlight all matching cells

### Game Controls

- **New Game** - Generate a fresh puzzle at current difficulty
- **Undo** - Step-by-step move reversal with full history
- **Hint** - Reveals a random empty cell's correct value
- **Solve** - Auto-complete the puzzle (marks as assisted)
- **Check** - Validate solution and highlight incorrect cells
- **PDF Export** - Download puzzle for offline play

### User Experience

- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Keyboard Support** - Full number pad and navigation support
- **Touch Optimized** - Mobile-friendly input handling
- **Progress Tracking** - Move counter and elapsed time
- **Win Detection** - Celebration modal on puzzle completion
- **Accessibility** - ARIA labels and semantic markup

## Tech Stack

### Core

| Package                                       | Version | Purpose                         |
| --------------------------------------------- | ------- | ------------------------------- |
| [Next.js](https://nextjs.org/)                | 16.x    | React framework with App Router |
| [React](https://react.dev/)                   | 19.x    | UI library                      |
| [TypeScript](https://www.typescriptlang.org/) | 5.x     | Type safety                     |
| [Tailwind CSS](https://tailwindcss.com/)      | 4.x     | Utility-first styling           |

### State & Utilities

| Package                                                     | Version | Purpose                      |
| ----------------------------------------------------------- | ------- | ---------------------------- |
| [Zustand](https://zustand-demo.pmnd.rs/)                    | 5.x     | Lightweight state management |
| [Lucide React](https://lucide.dev/)                         | 0.559.x | Beautiful icons              |
| [jsPDF](https://github.com/parallax/jsPDF)                  | 3.x     | PDF generation               |
| [clsx](https://github.com/lukeed/clsx)                      | 2.x     | Conditional classnames       |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 3.x     | Merge Tailwind classes       |

### Development

| Package | Version | Purpose        |
| ------- | ------- | -------------- |
| ESLint  | 9.x     | Code linting   |
| PostCSS | 8.x     | CSS processing |

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/brown2020/sodoku.git
cd sodoku

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

### Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
sodoku/
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles & animations
│   │   ├── layout.tsx         # Root layout with metadata
│   │   └── page.tsx           # Main page (renders SudokuMain)
│   │
│   ├── components/
│   │   ├── ControlPanel.tsx   # Game control buttons
│   │   ├── ErrorBoundary.tsx  # Error handling wrapper
│   │   ├── SudokuCell.tsx     # Individual cell (input/display)
│   │   ├── SudokuGrid.tsx     # 9x9 grid with 3x3 boxes
│   │   └── SudokuMain.tsx     # Main game container & sub-components
│   │
│   ├── lib/
│   │   └── utils.ts           # cn() helper, formatTime()
│   │
│   ├── store/
│   │   └── useGameStore.ts    # Zustand store (game state & actions)
│   │
│   ├── types/
│   │   └── index.ts           # TypeScript types & constants
│   │
│   └── utils/
│       ├── generatePdf.ts     # PDF export functionality
│       └── sudokuUtils.ts     # Puzzle generation & validation
│
├── public/
│   └── screenshot.png         # Game screenshot
│
├── next.config.mjs            # Next.js configuration
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies & scripts
```

## Architecture

### State Management

The game uses **Zustand** for global state management with a single store:

```typescript
// Key state slices
interface GameState {
  puzzle: number[][]; // Current puzzle state
  initialPuzzle: number[][]; // Original puzzle (for checking editable cells)
  solution: number[][]; // Complete solution
  conflicts: boolean[][]; // Conflict highlighting
  history: Move[]; // Undo history (delta-based)
  difficulty: Difficulty; // easy | medium | hard
  status: GameStatus; // isPuzzleFilled, isComplete, isSolved, hasWon
  stats: GameStats; // moveCount, timeElapsed, startTime
  selectedNumber: number | null; // For number highlighting
}
```

### Performance Optimizations

| Optimization                 | Implementation                                            |
| ---------------------------- | --------------------------------------------------------- |
| **Component Memoization**    | All components wrapped with `React.memo()`                |
| **Granular Selectors**       | `useShallow` for grouped state subscriptions              |
| **Delta-based History**      | Stores only `{position, previousValue}` per move          |
| **Static Config Extraction** | Button configs, difficulty levels outside components      |
| **Stable References**        | `useCallback` for handlers, `useMemo` for computed values |
| **Timeout Cleanup**          | Conflict timeout properly cleared on new game             |

### Puzzle Generation

1. **Full Grid Generation** - Backtracking algorithm fills a valid 9x9 grid
2. **Number Removal** - Randomly removes cells based on difficulty
3. **Fallback Grid** - Pre-computed valid grid if generation fails
4. **Minimum Clues** - Ensures at least 20 numbers remain visible

### Conflict Detection

Real-time validation checks:

- Row conflicts (duplicate in same row)
- Column conflicts (duplicate in same column)
- Box conflicts (duplicate in same 3x3 box)

## How to Play

### Controls

| Action           | Input                   |
| ---------------- | ----------------------- |
| Select cell      | Click/tap on cell       |
| Enter number     | Type 1-9                |
| Clear cell       | Backspace, Delete, or 0 |
| Highlight number | Click any filled cell   |

### Tips

- Use the **number highlighting** to spot where a number can go
- The **Check** button only works when all cells are filled
- **Hints** count as moves but don't disqualify a win
- Using **Solve** marks the game as assisted (no win modal)

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style (Prettier formatting)
- Add TypeScript types for new code
- Use Zustand selectors for state access
- Wrap new components with `memo()` when appropriate
- Test on mobile and desktop before submitting

## Roadmap

- [ ] Pencil marks (candidate numbers)
- [ ] Keyboard arrow navigation
- [ ] Local storage persistence
- [ ] Dark mode support
- [ ] Statistics tracking
- [ ] Daily challenges

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

- **GitHub**: [@brown2020](https://github.com/brown2020)
- **Email**: [info@ignitechannel.com](mailto:info@ignitechannel.com)
- **Website**: [ignite.me](https://ignite.me)

---

<p align="center">
  Built with ❤️ using Next.js 16, React 19, and Tailwind CSS 4
</p>
