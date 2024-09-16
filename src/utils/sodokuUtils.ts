// sudokuUtils.ts

// Generate a full, valid Sudoku grid
export const generateFullGrid = (): number[][] => {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));

  const canPlace = (
    grid: number[][],
    row: number,
    col: number,
    num: number
  ): boolean => {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    const subRowStart = Math.floor(row / 3) * 3;
    const subColStart = Math.floor(col / 3) * 3;
    for (let i = subRowStart; i < subRowStart + 3; i++) {
      for (let j = subColStart; j < subColStart + 3; j++) {
        if (grid[i][j] === num) return false;
      }
    }
    return true;
  };

  const fillGrid = (grid: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(
            () => Math.random() - 0.5
          );
          for (const num of numbers) {
            if (canPlace(grid, row, col, num)) {
              grid[row][col] = num;
              if (fillGrid(grid)) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  fillGrid(grid);
  return grid;
};

// Remove numbers from the grid to create a Sudoku puzzle
export const removeNumbers = (
  grid: number[][],
  difficulty: number
): number[][] => {
  const puzzle = grid.map((row) => [...row]); // Copy grid
  let attempts = difficulty;
  while (attempts > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      attempts--;
    }
  }
  return puzzle;
};

// Check for conflicts in the current puzzle state
export const checkConflicts = (currentPuzzle: number[][]): boolean[][] => {
  const newConflicts = Array.from({ length: 9 }, () => Array(9).fill(false));

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = currentPuzzle[row][col];
      if (num === 0) continue;

      // Check for duplicates in the row
      for (let c = 0; c < 9; c++) {
        if (c !== col && currentPuzzle[row][c] === num) {
          newConflicts[row][col] = true;
          newConflicts[row][c] = true;
        }
      }

      // Check for duplicates in the column
      for (let r = 0; r < 9; r++) {
        if (r !== row && currentPuzzle[r][col] === num) {
          newConflicts[row][col] = true;
          newConflicts[r][col] = true;
        }
      }

      // Check for duplicates in the 3x3 subgrid
      const subRowStart = Math.floor(row / 3) * 3;
      const subColStart = Math.floor(col / 3) * 3;
      for (let r = subRowStart; r < subRowStart + 3; r++) {
        for (let c = subColStart; c < subColStart + 3; c++) {
          if ((r !== row || c !== col) && currentPuzzle[r][c] === num) {
            newConflicts[row][col] = true;
            newConflicts[r][c] = true;
          }
        }
      }
    }
  }

  return newConflicts;
};
