export const GRID_SIZE = 9;
export const CELL_COUNT = GRID_SIZE * GRID_SIZE;

export type PuzzleFlat = Uint8Array;
export type ConflictsFlat = Uint8Array; // 0 | 1 per cell

export function toIndex(row: number, col: number): number {
  return row * GRID_SIZE + col;
}

export function fromIndex(index: number): { row: number; col: number } {
  return { row: Math.floor(index / GRID_SIZE), col: index % GRID_SIZE };
}

export function gridToFlat(grid: number[][]): PuzzleFlat {
  const flat = new Uint8Array(CELL_COUNT);
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      flat[toIndex(row, col)] = grid[row]?.[col] ?? 0;
    }
  }
  return flat;
}

export function flatToGrid(flat: ArrayLike<number>): number[][] {
  const grid: number[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(0)
  );
  for (let i = 0; i < CELL_COUNT; i++) {
    const { row, col } = fromIndex(i);
    grid[row][col] = flat[i] ?? 0;
  }
  return grid;
}

export function computeIsFilled(puzzle: ArrayLike<number>): boolean {
  for (let i = 0; i < CELL_COUNT; i++) {
    if ((puzzle[i] ?? 0) === 0) return false;
  }
  return true;
}

/**
 * Computes standard Sudoku rule conflicts (duplicates in row/col/box).
 * Uses a fast two-pass bitmask approach:
 * - Pass 1: build duplicate digit masks per row/col/box
 * - Pass 2: mark each cell conflicting if its digit is duplicated in any unit
 */
export function computeConflicts(puzzle: ArrayLike<number>): ConflictsFlat {
  const seenRow = new Uint16Array(GRID_SIZE);
  const seenCol = new Uint16Array(GRID_SIZE);
  const seenBox = new Uint16Array(GRID_SIZE);

  const dupRow = new Uint16Array(GRID_SIZE);
  const dupCol = new Uint16Array(GRID_SIZE);
  const dupBox = new Uint16Array(GRID_SIZE);

  for (let i = 0; i < CELL_COUNT; i++) {
    const value = puzzle[i] ?? 0;
    if (value === 0) continue;

    const { row, col } = fromIndex(i);
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    const bit = 1 << value; // value in 1..9 => fits in 16-bit

    if (seenRow[row] & bit) dupRow[row] |= bit;
    else seenRow[row] |= bit;

    if (seenCol[col] & bit) dupCol[col] |= bit;
    else seenCol[col] |= bit;

    if (seenBox[box] & bit) dupBox[box] |= bit;
    else seenBox[box] |= bit;
  }

  const conflicts = new Uint8Array(CELL_COUNT);
  for (let i = 0; i < CELL_COUNT; i++) {
    const value = puzzle[i] ?? 0;
    if (value === 0) continue;

    const { row, col } = fromIndex(i);
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    const bit = 1 << value;

    if ((dupRow[row] & bit) || (dupCol[col] & bit) || (dupBox[box] & bit)) {
      conflicts[i] = 1;
    }
  }

  return conflicts;
}

/**
 * Computes incorrect-cell highlights relative to a known solution.
 * Marks cells where puzzle differs from solution AND puzzle cell is non-zero.
 */
export function computeIncorrectCells(
  puzzle: ArrayLike<number>,
  solution: ArrayLike<number>
): ConflictsFlat {
  const conflicts = new Uint8Array(CELL_COUNT);
  for (let i = 0; i < CELL_COUNT; i++) {
    const p = puzzle[i] ?? 0;
    const s = solution[i] ?? 0;
    if (p !== 0 && p !== s) conflicts[i] = 1;
  }
  return conflicts;
}

export function isSolved(
  puzzle: ArrayLike<number>,
  solution: ArrayLike<number>
): boolean {
  for (let i = 0; i < CELL_COUNT; i++) {
    if ((puzzle[i] ?? 0) !== (solution[i] ?? 0)) return false;
  }
  return true;
}


