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
  isPuzzleFilled: boolean;
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
  puzzle: number[][];
  initialPuzzle: number[][];
  solution: number[][];
  conflicts: boolean[][];
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
