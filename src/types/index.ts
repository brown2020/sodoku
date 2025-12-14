export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTY_SETTINGS: Record<Difficulty, number> = {
  easy: 30,
  medium: 40,
  hard: 50,
} as const;

export type CellPosition = {
  row: number;
  col: number;
};

/** Stores only the delta for memory efficiency */
export type Move = {
  position: CellPosition;
  previousValue: number;
  previousNotes: number;
};

export interface GameStatus {
  isComplete: boolean;
  isSolved: boolean; // Used solver
  hasWon: boolean; // Legitimate win
}

export interface GameStats {
  moveCount: number;
  timeElapsed: number;
  startTime: number;
}

export interface GameState {
  /** Flat 81-length puzzle (row-major). Values are 0..9. */
  puzzle: Uint8Array;
  /** Flat 81-length immutable original puzzle (row-major). Values are 0..9. */
  initialPuzzle: Uint8Array;
  /** Flat 81-length solution (row-major). Values are 1..9. */
  solution: Uint8Array;
  /** Flat 81-length pencil marks bitmask (bits 1..9 used). */
  notes: Uint16Array;
  /**
   * When enabled, notes are treated as auto-generated candidates and will be
   * recomputed whenever the puzzle changes.
   */
  areNotesAuto: boolean;
  /** Live Sudoku rule conflicts (duplicates in row/col/box). */
  ruleConflicts: Uint8Array;
  /** "Check" button highlights (incorrect filled cells); cleared after a timeout or next edit. */
  checkHighlights: Uint8Array;
  /** Auto-check highlights (incorrect filled cells while enabled). */
  incorrectHighlights: Uint8Array;
  history: Move[];
  difficulty: Difficulty;
  status: GameStatus;
  stats: GameStats;
  selectedNumber: number | null;
  selectedCellIdx: number | null;
  isNotesMode: boolean;
  isAutoCheckEnabled: boolean;
}

export interface GameActions {
  setDifficulty: (difficulty: Difficulty) => void;
  generateNewGame: () => void;
  setCellValue: (row: number, col: number, value: number) => void;
  eraseCell: (row: number, col: number) => void;
  toggleNote: (row: number, col: number, value: number) => void;
  /** Auto-fills candidate notes for all empty cells based on current grid state. */
  autoFillNotes: () => void;
  toggleNotesMode: () => void;
  setSelectedCellIdx: (cellIdx: number | null) => void;
  inputNumber: (value: number) => void;
  eraseSelectedCell: () => void;
  toggleAutoCheck: () => void;
  selectNumber: (number: number | null) => void;
  checkCompletion: () => void;
  undoMove: () => void;
  provideHint: () => void;
  solveGame: () => void;
  updateTimer: () => void;
  clearConflictTimeout: () => void;
}
