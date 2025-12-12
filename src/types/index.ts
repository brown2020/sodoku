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
  /** Live Sudoku rule conflicts (duplicates in row/col/box). */
  ruleConflicts: Uint8Array;
  /** "Check" button highlights (incorrect filled cells); cleared after a timeout or next edit. */
  checkHighlights: Uint8Array;
  history: Move[];
  difficulty: Difficulty;
  status: GameStatus;
  stats: GameStats;
  selectedNumber: number | null;
}

export interface GameActions {
  setDifficulty: (difficulty: Difficulty) => void;
  generateNewGame: () => void;
  setCellValue: (row: number, col: number, value: number) => void;
  selectNumber: (number: number | null) => void;
  checkCompletion: () => void;
  undoMove: () => void;
  provideHint: () => void;
  solveGame: () => void;
  updateTimer: () => void;
  clearConflictTimeout: () => void;
}
