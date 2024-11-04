# Sudoku Game

A modern, feature-rich Sudoku game built with Next.js 14, TypeScript, and Tailwind CSS. This web application offers an engaging Sudoku experience with intelligent solution checking, visual feedback, and multiple difficulty levels.

![Sudoku Game Screenshot](./screenshot.png) <!-- Include an updated screenshot of your app -->

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Game Features](#game-features)
- [Technologies Used](#technologies-used)
- [Technical Implementation](#technical-implementation)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Performance Optimizations](#performance-optimizations)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

### Core Gameplay

- **Intelligent Grid Generation**: Creates valid, solvable Sudoku puzzles
- **Multiple Difficulty Levels**: Easy, Medium, and Hard modes
- **Real-time Validation**: Immediate feedback on number conflicts
- **Visual Feedback**: Highlights for conflicts, solved cells, and completed puzzles

### Game Assistance

- **Hint System**: Smart hints for stuck players
- **Solution Checker**: Validates current progress with visual feedback
- **Undo Functionality**: Step-by-step move reversal
- **Auto-solver**: Complete puzzle solution with highlighted filled cells

### User Experience

- **Responsive Design**: Optimized for all screen sizes and devices
- **Keyboard Support**: Full keyboard input functionality
- **Touch-friendly**: Mobile-optimized input handling
- **Visual Animations**: Smooth transitions and feedback animations
- **Progress Tracking**: Move counter and timer
- **PDF Export**: Save puzzles for offline play
- **Accessibility**: ARIA labels and keyboard navigation

## Demo

Experience the game live: [Sudoku Game](https://sodokuapp.vercel.app/)

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/brown2020/sodoku.git
   cd sodoku
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Basic Controls

- Click or tap cells to select them
- Use number keys (1-9) to input values
- Use Backspace or 0 to clear cells
- Use arrow keys for keyboard navigation

### Game Features

- **New Game**: Start a fresh puzzle with selected difficulty
- **Check Solution**: Validates current progress, highlighting mistakes
- **Hint**: Reveals one correct cell value
- **Undo**: Reverts the last move
- **Solve**: Shows complete solution with highlighted filled cells
- **Download**: Saves current puzzle state as PDF

## Technical Implementation

### State Management

- Custom `useSudoku` hook for centralized game logic
- Efficient state updates using React's `useState` and `useCallback`
- Memoized components to prevent unnecessary re-renders

### Grid Generation

- Backtracking algorithm for puzzle generation
- Unique solution verification
- Difficulty-based cell removal strategy

### Styling

- Responsive design using Tailwind CSS
- Dynamic styling based on game state
- CSS Grid for puzzle layout
- Custom animations for user feedback

## Project Structure

```
sodoku/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with metadata
│   │   ├── page.tsx            # Main game page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── SodokuMain.tsx      # Main game container
│   │   ├── ControlPanel.tsx    # Game controls
│   │   ├── SudokuGrid.tsx      # Grid component
│   │   ├── SudokuCell.tsx      # Individual cell component
│   │   └── ErrorBoundary.tsx   # Error handling
│   ├── hooks/
│   │   └── useSudoku.ts        # Game logic and state management
│   └── utils/
│       ├── generatePdf.ts      # PDF generation
│       └── sodokuUtils.ts      # Grid generation and validation
├── public/
│   └── screenshot.png          # Game screenshot
├── tailwind.config.ts          # Tailwind configuration
└── package.json                # Project dependencies
```

## Design Decisions

### State Management

- Custom hook approach for better code organization
- Centralized game logic for easier maintenance
- Atomic state updates for better performance

### User Interface

- Clean, minimalist design
- Clear visual feedback for all actions
- Mobile-first responsive approach
- Accessibility considerations

### Performance

- Component memoization
- Efficient state updates
- Dynamic imports for code splitting
- Optimized re-renders

## Performance Optimizations

- Memoized components using React.memo
- useCallback for event handlers
- Efficient grid generation algorithm
- Optimized styling with Tailwind CSS
- Dynamic imports for larger components

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

- **GitHub**: [brown2020](https://github.com/brown2020)
- **Email**: [info@ignitechannel.com](mailto:info@ignitechannel.com)
- **Website**: [ignite.me](https://ignite.me)

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
