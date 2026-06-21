// sudokuUtils.ts

import {
  GRID_SIZE,
  CELL_COUNT,
  MAX_REMOVAL_RATIO,
  MIN_VISIBLE_CELLS,
} from "@/constants";

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const FULL_DIGIT_MASK = 0b1111111110;

/**
 * Creates a 9x9 grid filled with the specified value
 */
const createEmptyGrid = <T>(fill: T): T[][] =>
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

const countBits = (mask: number): number => {
  let count = 0;
  let remaining = mask;
  while (remaining !== 0) {
    remaining &= remaining - 1;
    count++;
  }
  return count;
};

const getBoxIndex = (row: number, col: number): number =>
  Math.floor(row / 3) * 3 + Math.floor(col / 3);

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

const countSolutions = (grid: number[][], limit = 2): number => {
  const puzzle = grid.map((row) => [...row]);
  const rowUsed = new Uint16Array(GRID_SIZE);
  const colUsed = new Uint16Array(GRID_SIZE);
  const boxUsed = new Uint16Array(GRID_SIZE);

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const value = puzzle[row][col] ?? 0;
      if (value === 0) continue;
      if (value < 1 || value > 9) return 0;

      const bit = 1 << value;
      const box = getBoxIndex(row, col);
      if (rowUsed[row] & bit || colUsed[col] & bit || boxUsed[box] & bit) {
        return 0;
      }

      rowUsed[row] |= bit;
      colUsed[col] |= bit;
      boxUsed[box] |= bit;
    }
  }

  const solve = (): number => {
    let bestRow = -1;
    let bestCol = -1;
    let bestMask = 0;
    let bestCount = 10;

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (puzzle[row][col] !== 0) continue;

        const box = getBoxIndex(row, col);
        const mask = FULL_DIGIT_MASK & ~(rowUsed[row] | colUsed[col] | boxUsed[box]);
        const candidateCount = countBits(mask);

        if (candidateCount === 0) return 0;
        if (candidateCount < bestCount) {
          bestRow = row;
          bestCol = col;
          bestMask = mask;
          bestCount = candidateCount;
          if (candidateCount === 1) break;
        }
      }
      if (bestCount === 1) break;
    }

    if (bestRow === -1 || bestCol === -1) return 1;

    let solutions = 0;
    const box = getBoxIndex(bestRow, bestCol);
    for (const value of DIGITS) {
      const bit = 1 << value;
      if ((bestMask & bit) === 0) continue;

      puzzle[bestRow][bestCol] = value;
      rowUsed[bestRow] |= bit;
      colUsed[bestCol] |= bit;
      boxUsed[box] |= bit;

      solutions += solve();

      puzzle[bestRow][bestCol] = 0;
      rowUsed[bestRow] &= ~bit;
      colUsed[bestCol] &= ~bit;
      boxUsed[box] &= ~bit;

      if (solutions >= limit) return solutions;
    }

    return solutions;
  };

  return solve();
};

const hasUniqueSolution = (grid: number[][]): boolean =>
  countSolutions(grid, 2) === 1;

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
            const numbers = shuffle(DIGITS);

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
      return fallbackGrid;
    }

    return grid;
  } catch {
    return fallbackGrid;
  }
};

export const removeNumbers = (
  grid: number[][],
  numbersToRemove: number
): number[][] => {
  // Create a deep copy of the grid
  const puzzle = grid.map((row) => [...row]);

  // Limit removal to a reasonable percentage and clue floor.
  const maxRemovable = Math.min(
    Math.floor(CELL_COUNT * MAX_REMOVAL_RATIO),
    CELL_COUNT - MIN_VISIBLE_CELLS
  );
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

  // Remove cells only when the puzzle keeps a unique solution.
  let removedCount = 0;
  for (
    let i = 0;
    i < allPositions.length && removedCount < actualNumbersToRemove;
    i++
  ) {
    const { row, col } = allPositions[i];
    const previousValue = puzzle[row][col];
    puzzle[row][col] = 0;

    if (hasUniqueSolution(puzzle)) {
      removedCount++;
    } else {
      puzzle[row][col] = previousValue;
    }
  }

  return puzzle;
};
