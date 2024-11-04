// sudokuUtils.ts

// Utility function to check if a number can be placed in a cell
const canPlace = (
  grid: number[][],
  row: number,
  col: number,
  num: number
): boolean => {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[boxRow + i][boxCol + j] === num) return false;
    }
  }

  return true;
};

// Generate a complete valid grid
export const generateFullGrid = (): number[][] => {
  const grid = Array(9)
    .fill(0)
    .map(() => Array(9).fill(0));

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

// THIS IS THE FIXED removeNumbers FUNCTION
export const removeNumbers = (
  grid: number[][],
  numbersToRemove: number
): number[][] => {
  // Create a deep copy of the grid
  const puzzle = grid.map((row) => [...row]);

  // Create an array of all valid positions
  const allPositions = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      allPositions.push({ row, col });
    }
  }

  // Shuffle the positions
  for (let i = allPositions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
  }

  // Remove the specified number of cells
  for (let i = 0; i < numbersToRemove && i < allPositions.length; i++) {
    const { row, col } = allPositions[i];
    puzzle[row][col] = 0;
  }

  return puzzle;
};

// Check for conflicts in the current puzzle state
export const checkConflicts = (currentPuzzle: number[][]): boolean[][] => {
  const conflicts = Array.from({ length: 9 }, () => Array(9).fill(false));

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = currentPuzzle[row][col];
      if (value === 0) continue;

      // Check row
      for (let c = 0; c < 9; c++) {
        if (c !== col && currentPuzzle[row][c] === value) {
          conflicts[row][col] = true;
          conflicts[row][c] = true;
        }
      }

      // Check column
      for (let r = 0; r < 9; r++) {
        if (r !== row && currentPuzzle[r][col] === value) {
          conflicts[row][col] = true;
          conflicts[r][col] = true;
        }
      }

      // Check 3x3 box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let r = boxRow; r < boxRow + 3; r++) {
        for (let c = boxCol; c < boxCol + 3; c++) {
          if ((r !== row || c !== col) && currentPuzzle[r][c] === value) {
            conflicts[row][col] = true;
            conflicts[r][c] = true;
          }
        }
      }
    }
  }

  return conflicts;
};

export { canPlace };
