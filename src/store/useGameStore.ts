import { create } from "zustand";
import { generateFullGrid, removeNumbers } from "@/utils/sudokuUtils";
import {
  Difficulty,
  GameState,
  GameActions,
  DIFFICULTY_SETTINGS,
} from "@/types";
import {
  computeConflicts,
  computeIncorrectCells,
  fromIndex,
  gridToFlat,
  toIndex,
} from "@/utils/gameEngine";

interface GameStore extends GameState, GameActions {
  conflictTimeoutId: ReturnType<typeof setTimeout> | null;
  _applyMove: (args: {
    nextPuzzle: Uint8Array;
    nextHistory?: GameState["history"];
    nextMoveCount?: number;
  }) => void;
}

const getInitialState = (): GameState & {
  conflictTimeoutId: ReturnType<typeof setTimeout> | null;
} => ({
  puzzle: new Uint8Array(81),
  initialPuzzle: new Uint8Array(81),
  solution: new Uint8Array(81),
  ruleConflicts: new Uint8Array(81),
  checkHighlights: new Uint8Array(81),
  history: [],
  difficulty: "medium",
  status: {
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

  /**
   * Internal helper to keep puzzle/history/conflicts/stats consistent.
   * - Recomputes live rule conflicts
   * - Clears "check" highlights (to avoid stale incorrect markers after edits)
   */
  _applyMove: (
    args: {
      nextPuzzle: Uint8Array;
      nextHistory?: GameState["history"];
      nextMoveCount?: number;
    }
  ) => {
    const { stats } = get();
    set({
      puzzle: args.nextPuzzle,
      history: args.nextHistory ?? get().history,
      ruleConflicts: computeConflicts(args.nextPuzzle),
      checkHighlights: new Uint8Array(81),
      stats: {
        ...stats,
        moveCount: args.nextMoveCount ?? stats.moveCount,
      },
    });
  },

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

    const puzzleFlat = gridToFlat(newPuzzle);
    const solutionFlat = gridToFlat(fullGrid);

    set({
      puzzle: puzzleFlat,
      initialPuzzle: puzzleFlat.slice(),
      solution: solutionFlat,
      ruleConflicts: computeConflicts(puzzleFlat),
      checkHighlights: new Uint8Array(81),
      history: [],
      status: {
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
    const idx = toIndex(row, col);

    // Prevent editing initial cells or if game is complete
    if ((initialPuzzle[idx] ?? 0) !== 0 || status.isComplete) return;

    // Store the previous value for delta-based history
    const previousValue = puzzle[idx] ?? 0;

    const nextPuzzle = puzzle.slice();
    nextPuzzle[idx] = value;

    // Update history with delta (only position + previous value)
    const newHistory = [...history, { position: { row, col }, previousValue }];

    get()._applyMove({
      nextPuzzle,
      nextHistory: newHistory,
      nextMoveCount: stats.moveCount + 1,
    });
  },

  selectNumber: (number: number | null) => {
    set({ selectedNumber: number });
  },

  checkCompletion: () => {
    const { puzzle, solution, status } = get();

    // Clear any existing timeout
    get().clearConflictTimeout();

    const isCorrect = puzzle.every((v, i) => v === solution[i]);

    if (isCorrect) {
      set({
        status: {
          ...status,
          isComplete: true,
          hasWon: !status.isSolved,
        },
        checkHighlights: new Uint8Array(81),
      });
    } else {
      const incorrect = computeIncorrectCells(puzzle, solution);
      // Store timeout ID so we can clear it if needed
      const timeoutId = setTimeout(() => {
        set({
          checkHighlights: new Uint8Array(81),
          conflictTimeoutId: null,
        });
      }, 2000);

      set({
        checkHighlights: incorrect,
        conflictTimeoutId: timeoutId,
      });
    }
  },

  undoMove: () => {
    const { history, puzzle, stats, status } = get();
    if (history.length === 0) return;
    if (status.isComplete) return;

    const lastMove = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    const idx = toIndex(lastMove.position.row, lastMove.position.col);
    const nextPuzzle = puzzle.slice();
    nextPuzzle[idx] = lastMove.previousValue;

    get()._applyMove({
      nextPuzzle,
      nextHistory: newHistory,
      nextMoveCount: Math.max(0, stats.moveCount - 1),
    });
  },

  provideHint: () => {
    const { puzzle, solution, status, stats, history } = get();
    if (status.isComplete) return;

    const emptyIndexes: number[] = [];
    for (let i = 0; i < 81; i++) {
      if (puzzle[i] === 0) emptyIndexes.push(i);
    }

    if (emptyIndexes.length > 0) {
      const idx = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      const previousValue = puzzle[idx] ?? 0;
      const nextPuzzle = puzzle.slice();
      nextPuzzle[idx] = solution[idx] ?? 0;
      const { row, col } = fromIndex(idx);
      const newHistory = [...history, { position: { row, col }, previousValue }];
      get()._applyMove({
        nextPuzzle,
        nextHistory: newHistory,
        nextMoveCount: stats.moveCount + 1,
      });
    }
  },

  solveGame: () => {
    const { solution } = get();

    // Clear any pending conflict timeout
    get().clearConflictTimeout();

    set({
      puzzle: solution.slice(),
      ruleConflicts: new Uint8Array(81),
      checkHighlights: new Uint8Array(81),
      status: {
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
