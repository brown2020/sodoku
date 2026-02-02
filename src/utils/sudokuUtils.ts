// sudokuUtils.ts

import {
  GRID_SIZE,
  CELL_COUNT,
  MAX_REMOVAL_RATIO,
  MIN_VISIBLE_CELLS,
} from "@/constants";

/**
 * Creates a 9x9 grid filled with the specified value
 */
export const createEmptyGrid = <T>(fill: T): T[][] =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(fill));

/**
 * Fisher-Yates shuffle for unbiased randomization
 */
const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

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
  // Create a fixed valid grid as a fallback
  const fallbackGrid = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  try {
    const grid = createEmptyGrid(0);

    const fillGrid = (grid: number[][]): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === 0) {
            const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

            for (const num of numbers) {
              if (canPlace(grid, row, col, num)) {
                grid[row][col] = num;

                // If we've filled the entire grid or successfully filled the rest
                if ((row === 8 && col === 8) || fillGrid(grid)) {
                  return true;
                }

                // Backtrack if unsuccessful
                grid[row][col] = 0;
              }
            }
            // No valid number found, need to backtrack
            return false;
          }
        }
      }
      // Grid is completely filled
      return true;
    };

    const success = fillGrid(grid);

    // Check if the grid is valid (no zeros)
    const hasZeros = grid.some((row) => row.some((cell) => cell === 0));
    if (hasZeros || !success) {
      console.warn("Grid generation failed, using fallback grid");
      return fallbackGrid;
    }

    return grid;
  } catch (error) {
    console.error("Error in grid generation:", error);
    return fallbackGrid;
  }
};

export const removeNumbers = (
  grid: number[][],
  numbersToRemove: number
): number[][] => {
  // Create a deep copy of the grid
  const puzzle = grid.map((row) => [...row]);

  // Limit removal to a reasonable percentage
  const maxRemovable = Math.floor(CELL_COUNT * MAX_REMOVAL_RATIO);
  const actualNumbersToRemove = Math.min(numbersToRemove, maxRemovable);

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
  for (let i = 0; i < actualNumbersToRemove && i < allPositions.length; i++) {
    const { row, col } = allPositions[i];
    puzzle[row][col] = 0;
  }

  // Ensure we have at least MIN_VISIBLE_CELLS numbers visible
  const filledCount = puzzle.flat().filter((cell) => cell !== 0).length;

  if (filledCount < MIN_VISIBLE_CELLS) {
    // If we have less than minimum filled cells, add back some numbers
    const emptyPositions = allPositions.slice(0, actualNumbersToRemove);
    const neededToAdd = MIN_VISIBLE_CELLS - filledCount;

    for (let i = 0; i < neededToAdd && i < emptyPositions.length; i++) {
      const { row, col } = emptyPositions[i];
      puzzle[row][col] = grid[row][col]; // Restore the original number
    }
  }

  return puzzle;
};

// NOTE: conflict detection for gameplay moved to `src/utils/gameEngine.ts` for performance.
