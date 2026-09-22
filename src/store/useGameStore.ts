import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateFullGrid, removeNumbers } from "@/utils/sudokuUtils";
import {
  Difficulty,
  GameState,
  GameActions,
  DIFFICULTY_SETTINGS,
} from "@/types";
import {
  computeConflicts,
  computeCandidateNotes,
  computeIncorrectCells,
  fromIndex,
  isSolved,
  computeIsFilled,
  gridToFlat,
  toIndex,
} from "@/utils/gameEngine";
import { MAX_HISTORY_SIZE } from "@/constants";

type BestTimes = Partial<Record<Difficulty, number>>;

interface GameStore extends GameState, GameActions {
  conflictTimeoutId: ReturnType<typeof setTimeout> | null;
  bestTimes: BestTimes;
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  _applyMove: (args: {
    nextPuzzle: Uint8Array;
    nextNotes?: Uint16Array;
    nextHistory?: GameState["history"];
    nextMoveCount?: number;
  }) => void;
}

const getInitialState = (): GameState & {
  conflictTimeoutId: ReturnType<typeof setTimeout> | null;
  bestTimes: BestTimes;
  _hasHydrated: boolean;
} => ({
  puzzle: new Uint8Array(81),
  initialPuzzle: new Uint8Array(81),
  solution: new Uint8Array(81),
  notes: new Uint16Array(81),
  areNotesAuto: false,
  ruleConflicts: new Uint8Array(81),
  checkHighlights: new Uint8Array(81),
  incorrectHighlights: new Uint8Array(81),
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
  selectedCellIdx: null,
  isNotesMode: false,
  isAutoCheckEnabled: false,
  conflictTimeoutId: null,
  bestTimes: {},
  _hasHydrated: false,
});

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      setHasHydrated: (value: boolean) => set({ _hasHydrated: value }),

      /**
       * Internal helper to keep puzzle/history/conflicts/stats consistent.
       */
      _applyMove: (args: {
        nextPuzzle: Uint8Array;
        nextNotes?: Uint16Array;
        nextHistory?: GameState["history"];
        nextMoveCount?: number;
      }) => {
        const { stats, solution, status, isAutoCheckEnabled, areNotesAuto, difficulty, bestTimes } =
          get();
        const didPuzzleChange = args.nextPuzzle !== get().puzzle;
        const nextNotes =
          areNotesAuto && didPuzzleChange
            ? computeCandidateNotes(args.nextPuzzle)
            : args.nextNotes ?? get().notes;

        const nextIncorrectHighlights = isAutoCheckEnabled
          ? computeIncorrectCells(args.nextPuzzle, solution)
          : new Uint8Array(81);

        const hasWonNow =
          !status.isSolved &&
          computeIsFilled(args.nextPuzzle) &&
          isSolved(args.nextPuzzle, solution);

        const nextMoveCount = args.nextMoveCount ?? stats.moveCount;
        const nextTime = stats.timeElapsed;
        let nextBest = bestTimes;
        if (hasWonNow) {
          const prev = bestTimes[difficulty];
          if (prev == null || nextTime < prev) {
            nextBest = { ...bestTimes, [difficulty]: nextTime };
          }
        }

        set({
          puzzle: args.nextPuzzle,
          notes: nextNotes,
          history: args.nextHistory ?? get().history,
          ruleConflicts: computeConflicts(args.nextPuzzle),
          checkHighlights: new Uint8Array(81),
          incorrectHighlights: nextIncorrectHighlights,
          bestTimes: nextBest,
          stats: {
            ...stats,
            moveCount: nextMoveCount,
          },
          status: hasWonNow
            ? { ...status, isComplete: true, hasWon: true }
            : status,
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
          notes: new Uint16Array(81),
          areNotesAuto: false,
          ruleConflicts: computeConflicts(puzzleFlat),
          checkHighlights: new Uint8Array(81),
          incorrectHighlights: new Uint8Array(81),
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
          selectedCellIdx: null,
          isNotesMode: false,
        });
      },

      setCellValue: (row: number, col: number, value: number) => {
        if (row < 0 || row > 8 || col < 0 || col > 8) return;
        if (value < 0 || value > 9) return;

        const { puzzle, initialPuzzle, status, history, stats, notes } = get();
        const idx = toIndex(row, col);

        if ((initialPuzzle[idx] ?? 0) !== 0 || status.isComplete) return;

        const previousValue = puzzle[idx] ?? 0;
        const previousNotes = notes[idx] ?? 0;
        if (previousValue === value && previousNotes === 0) return;

        const nextPuzzle = puzzle.slice();
        nextPuzzle[idx] = value;
        const nextNotes = notes.slice();
        nextNotes[idx] = 0;

        const newHistory = [
          ...history,
          { position: { row, col }, previousValue, previousNotes },
        ].slice(-MAX_HISTORY_SIZE);

        get()._applyMove({
          nextPuzzle,
          nextNotes,
          nextHistory: newHistory,
          nextMoveCount: stats.moveCount + 1,
        });
      },

      eraseCell: (row: number, col: number) => {
        get().setCellValue(row, col, 0);
      },

      toggleNote: (row: number, col: number, value: number) => {
        if (row < 0 || row > 8 || col < 0 || col > 8) return;
        if (value < 1 || value > 9) return;

        const { puzzle, initialPuzzle, status, history, stats, notes } = get();
        const idx = toIndex(row, col);
        if ((initialPuzzle[idx] ?? 0) !== 0 || status.isComplete) return;
        if ((puzzle[idx] ?? 0) !== 0) return;

        const previousValue = 0;
        const previousNotes = notes[idx] ?? 0;

        const bit = 1 << value;
        const nextNotes = notes.slice();
        nextNotes[idx] = previousNotes ^ bit;

        const newHistory = [
          ...history,
          { position: { row, col }, previousValue, previousNotes },
        ].slice(-MAX_HISTORY_SIZE);

        get()._applyMove({
          nextPuzzle: puzzle,
          nextNotes,
          nextHistory: newHistory,
          nextMoveCount: stats.moveCount + 1,
        });
      },

      autoFillNotes: () => {
        const { puzzle, status } = get();
        if (status.isComplete) return;
        set({ notes: computeCandidateNotes(puzzle), areNotesAuto: true });
      },

      toggleNotesMode: () => {
        set((s) => ({ isNotesMode: !s.isNotesMode }));
      },

      setSelectedCellIdx: (cellIdx: number | null) => {
        set({ selectedCellIdx: cellIdx });
      },

      inputNumber: (value: number) => {
        const { selectedCellIdx, isNotesMode } = get();
        if (selectedCellIdx == null) return;
        if (value < 1 || value > 9) return;
        const row = Math.floor(selectedCellIdx / 9);
        const col = selectedCellIdx % 9;
        if (isNotesMode) get().toggleNote(row, col, value);
        else get().setCellValue(row, col, value);
      },

      eraseSelectedCell: () => {
        const { selectedCellIdx } = get();
        if (selectedCellIdx == null) return;
        const row = Math.floor(selectedCellIdx / 9);
        const col = selectedCellIdx % 9;
        get().eraseCell(row, col);
      },

      toggleAutoCheck: () => {
        set((s) => {
          const isAutoCheckEnabled = !s.isAutoCheckEnabled;
          return {
            isAutoCheckEnabled,
            incorrectHighlights: isAutoCheckEnabled
              ? computeIncorrectCells(s.puzzle, s.solution)
              : new Uint8Array(81),
          };
        });
      },

      selectNumber: (number: number | null) => {
        set({ selectedNumber: number });
      },

      checkCompletion: () => {
        const { puzzle, solution, status, conflictTimeoutId } = get();

        if (conflictTimeoutId) {
          clearTimeout(conflictTimeoutId);
          set({ conflictTimeoutId: null });
        }

        const isCorrect = puzzle.every((v, i) => v === solution[i]);

        if (isCorrect) {
          const { difficulty, bestTimes, stats } = get();
          const prev = bestTimes[difficulty];
          const nextBest =
            prev == null || stats.timeElapsed < prev
              ? { ...bestTimes, [difficulty]: stats.timeElapsed }
              : bestTimes;
          set({
            status: {
              ...status,
              isComplete: true,
              hasWon: !status.isSolved,
            },
            checkHighlights: new Uint8Array(81),
            bestTimes: nextBest,
          });
        } else {
          const incorrect = computeIncorrectCells(puzzle, solution);
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
        const { history, puzzle, notes, stats, status } = get();
        if (history.length === 0) return;
        if (status.isComplete) return;

        const lastMove = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        const idx = toIndex(lastMove.position.row, lastMove.position.col);
        const nextPuzzle = puzzle.slice();
        nextPuzzle[idx] = lastMove.previousValue;
        const nextNotes = notes.slice();
        nextNotes[idx] = lastMove.previousNotes;

        get()._applyMove({
          nextPuzzle,
          nextNotes,
          nextHistory: newHistory,
          nextMoveCount: Math.max(0, stats.moveCount - 1),
        });
      },

      provideHint: () => {
        const { puzzle, solution, status, stats, history, notes } = get();
        if (status.isComplete) return;

        const emptyIndexes: number[] = [];
        for (let i = 0; i < 81; i++) {
          if (puzzle[i] === 0) emptyIndexes.push(i);
        }

        if (emptyIndexes.length > 0) {
          const idx =
            emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
          const previousValue = puzzle[idx] ?? 0;
          const previousNotes = notes[idx] ?? 0;
          const nextPuzzle = puzzle.slice();
          nextPuzzle[idx] = solution[idx] ?? 0;
          const nextNotes = notes.slice();
          nextNotes[idx] = 0;
          const { row, col } = fromIndex(idx);
          const newHistory = [
            ...history,
            { position: { row, col }, previousValue, previousNotes },
          ].slice(-MAX_HISTORY_SIZE);
          get()._applyMove({
            nextPuzzle,
            nextNotes,
            nextHistory: newHistory,
            nextMoveCount: stats.moveCount + 1,
          });
        }
      },

      solveGame: () => {
        const { solution } = get();
        get().clearConflictTimeout();

        set({
          puzzle: solution.slice(),
          notes: new Uint16Array(81),
          ruleConflicts: new Uint8Array(81),
          checkHighlights: new Uint8Array(81),
          incorrectHighlights: new Uint8Array(81),
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
    }),
    {
      name: "sodoku-storage",
      partialize: (state) => ({
        difficulty: state.difficulty,
        bestTimes: state.bestTimes,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
