export type Difficulty = 'easy' | 'medium' | 'hard';

export type CellPosition = {
  row: number;
  col: number;
};

export type Move = {
  puzzle: number[][];
  position: CellPosition;
};

export interface GameState {
  puzzle: number[][];
  initialPuzzle: number[][];
  solution: number[][];
  conflicts: boolean[][];
  history: Move[];
  difficulty: Difficulty;
  status: {
    isPuzzleFilled: boolean;
    isComplete: boolean;
    isSolved: boolean; // Used solver
    hasWon: boolean; // Legitimate win
  };
  stats: {
    moveCount: number;
    timeElapsed: number;
    startTime: number;
  };
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
  resetGame: () => void;
  updateTimer: () => void;
}

