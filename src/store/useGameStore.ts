import { create } from 'zustand';
import { checkConflicts, generateFullGrid, removeNumbers } from '@/utils/sudokuUtils';
import { Difficulty, GameState, GameActions } from '@/types';

interface GameStore extends GameState, GameActions {}

const DIFFICULTY_SETTINGS = {
  easy: 30,
  medium: 40,
  hard: 50,
};

const getInitialState = (): GameState => ({
  puzzle: Array.from({ length: 9 }, () => Array(9).fill(0)),
  initialPuzzle: Array.from({ length: 9 }, () => Array(9).fill(0)),
  solution: Array.from({ length: 9 }, () => Array(9).fill(0)),
  conflicts: Array.from({ length: 9 }, () => Array(9).fill(false)),
  history: [],
  difficulty: 'medium',
  status: {
    isPuzzleFilled: false,
    isComplete: false,
    isSolved: false,
    hasWon: false,
  },
  stats: {
    moveCount: 0,
    timeElapsed: 0,
    startTime: 0,
  },
  selectedNumber: null,
});

export const useGameStore = create<GameStore>((set, get) => ({
  ...getInitialState(),

  setDifficulty: (difficulty: Difficulty) => {
    set({ difficulty });
    get().generateNewGame();
  },

  generateNewGame: () => {
    const { difficulty } = get();
    const fullGrid = generateFullGrid();
    const numbersToRemove = DIFFICULTY_SETTINGS[difficulty];
    const newPuzzle = removeNumbers(fullGrid, numbersToRemove);
    
    set({
      puzzle: newPuzzle.map(row => [...row]),
      initialPuzzle: newPuzzle.map(row => [...row]),
      solution: fullGrid,
      conflicts: Array.from({ length: 9 }, () => Array(9).fill(false)),
      history: [],
      status: {
        isPuzzleFilled: false,
        isComplete: false,
        isSolved: false,
        hasWon: false,
      },
      stats: {
        moveCount: 0,
        timeElapsed: 0,
        startTime: Date.now(),
      },
      selectedNumber: null,
    });
  },

  setCellValue: (row: number, col: number, value: number) => {
    const { puzzle, initialPuzzle, status, history, stats } = get();

    // Prevent editing initial cells or if game is complete
    if (initialPuzzle[row][col] !== 0 || status.isComplete) return;

    const newPuzzle = puzzle.map((r) => [...r]);
    newPuzzle[row][col] = value;

    // Check if filled
    const isPuzzleFilled = newPuzzle.every((r) => r.every((c) => c !== 0));
    
    // Update conflicts
    const newConflicts = checkConflicts(newPuzzle);

    // Update history
    const newHistory = [
      ...history,
      { puzzle: puzzle.map(r => [...r]), position: { row, col } }
    ];

    set({
      puzzle: newPuzzle,
      conflicts: newConflicts,
      history: newHistory,
      status: {
        ...status,
        isPuzzleFilled,
      },
      stats: {
        ...stats,
        moveCount: stats.moveCount + 1,
      },
    });
  },

  selectNumber: (number: number | null) => {
    set({ selectedNumber: number });
  },

  checkCompletion: () => {
    const { puzzle, solution, status } = get();
    
    let isCorrect = true;
    const newConflicts = Array.from({ length: 9 }, () => Array(9).fill(false));
    
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzle[i][j] !== solution[i][j]) {
          isCorrect = false;
          if (puzzle[i][j] !== 0) {
            newConflicts[i][j] = true;
          }
        }
      }
    }

    if (isCorrect) {
      set({
        status: {
          ...status,
          isComplete: true,
          hasWon: !status.isSolved,
        },
        conflicts: Array.from({ length: 9 }, () => Array(9).fill(false)),
      });
    } else {
      set({ conflicts: newConflicts });
      // Clear conflicts after 2 seconds
      setTimeout(() => {
        set((state) => ({
          conflicts: Array.from({ length: 9 }, () => Array(9).fill(false)),
        }));
      }, 2000);
    }
  },

  undoMove: () => {
    const { history, stats } = get();
    if (history.length === 0) return;

    const lastMove = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    const conflicts = checkConflicts(lastMove.puzzle);

    set({
      puzzle: lastMove.puzzle,
      history: newHistory,
      conflicts,
      stats: {
        ...stats,
        moveCount: Math.max(0, stats.moveCount - 1),
      },
    });
  },

  provideHint: () => {
    const { puzzle, solution, status, stats } = get();
    if (status.isComplete) return;

    const emptyCells: { row: number; col: number }[] = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzle[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newPuzzle = puzzle.map(r => [...r]);
      newPuzzle[row][col] = solution[row][col];

      set({
        puzzle: newPuzzle,
        stats: {
          ...stats,
          moveCount: stats.moveCount + 1,
        },
      });
    }
  },

  solveGame: () => {
    const { solution } = get();
    set({
      puzzle: solution.map(r => [...r]),
      conflicts: Array.from({ length: 9 }, () => Array(9).fill(false)),
      status: {
        isPuzzleFilled: true,
        isComplete: true,
        isSolved: true,
        hasWon: false,
      },
    });
  },

  resetGame: () => {
    const { difficulty } = get();
    get().setDifficulty(difficulty); // Re-triggers generation
  },

  updateTimer: () => {
    const { stats, status } = get();
    if (!status.isComplete && stats.startTime) {
      set({
        stats: {
          ...stats,
          timeElapsed: Math.floor((Date.now() - stats.startTime) / 1000),
        },
      });
    }
  },
}));

