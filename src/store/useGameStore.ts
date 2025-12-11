import { create } from "zustand";
import {
  checkConflicts,
  generateFullGrid,
  removeNumbers,
  createEmptyGrid,
} from "@/utils/sudokuUtils";
import {
  Difficulty,
  GameState,
  GameActions,
  DIFFICULTY_SETTINGS,
} from "@/types";

interface GameStore extends GameState, GameActions {
  conflictTimeoutId: ReturnType<typeof setTimeout> | null;
}

const getInitialState = (): GameState & {
  conflictTimeoutId: ReturnType<typeof setTimeout> | null;
} => ({
  puzzle: createEmptyGrid(0),
  initialPuzzle: createEmptyGrid(0),
  solution: createEmptyGrid(0),
  conflicts: createEmptyGrid(false),
  history: [],
  difficulty: "medium",
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
  conflictTimeoutId: null,
});

export const useGameStore = create<GameStore>((set, get) => ({
  ...getInitialState(),

  clearConflictTimeout: () => {
    const { conflictTimeoutId } = get();
    if (conflictTimeoutId) {
      clearTimeout(conflictTimeoutId);
      set({ conflictTimeoutId: null });
    }
  },

  setDifficulty: (difficulty: Difficulty) => {
    set({ difficulty });
    get().generateNewGame();
  },

  generateNewGame: () => {
    const { difficulty } = get();

    // Clear any pending conflict timeout
    get().clearConflictTimeout();

    const fullGrid = generateFullGrid();
    const numbersToRemove = DIFFICULTY_SETTINGS[difficulty];
    const newPuzzle = removeNumbers(fullGrid, numbersToRemove);

    set({
      puzzle: newPuzzle.map((row) => [...row]),
      initialPuzzle: newPuzzle.map((row) => [...row]),
      solution: fullGrid,
      conflicts: createEmptyGrid(false),
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

    // Store the previous value for delta-based history
    const previousValue = puzzle[row][col];

    const newPuzzle = puzzle.map((r) => [...r]);
    newPuzzle[row][col] = value;

    // Check if filled
    const isPuzzleFilled = newPuzzle.every((r) => r.every((c) => c !== 0));

    // Update conflicts
    const newConflicts = checkConflicts(newPuzzle);

    // Update history with delta (only position + previous value)
    const newHistory = [...history, { position: { row, col }, previousValue }];

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

    // Clear any existing timeout
    get().clearConflictTimeout();

    let isCorrect = true;
    const newConflicts = createEmptyGrid(false);

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
        conflicts: createEmptyGrid(false),
      });
    } else {
      // Store timeout ID so we can clear it if needed
      const timeoutId = setTimeout(() => {
        set({
          conflicts: createEmptyGrid(false),
          conflictTimeoutId: null,
        });
      }, 2000);

      set({
        conflicts: newConflicts,
        conflictTimeoutId: timeoutId,
      });
    }
  },

  undoMove: () => {
    const { history, puzzle, stats } = get();
    if (history.length === 0) return;

    const lastMove = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    // Apply the delta - restore previous value
    const newPuzzle = puzzle.map((r) => [...r]);
    newPuzzle[lastMove.position.row][lastMove.position.col] =
      lastMove.previousValue;

    const conflicts = checkConflicts(newPuzzle);

    set({
      puzzle: newPuzzle,
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
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newPuzzle = puzzle.map((r) => [...r]);
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

    // Clear any pending conflict timeout
    get().clearConflictTimeout();

    set({
      puzzle: solution.map((r) => [...r]),
      conflicts: createEmptyGrid(false),
      status: {
        isPuzzleFilled: true,
        isComplete: true,
        isSolved: true,
        hasWon: false,
      },
    });
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
