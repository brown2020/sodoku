import { GRID_SIZE, CELL_COUNT } from "@/constants";

export type PuzzleFlat = Uint8Array;

/**
 * Converts row/col coordinates to flat array index
 */
export function toIndex(row: number, col: number): number {
  return row * GRID_SIZE + col;
}

/**
 * Converts flat array index to row/col coordinates
 */
export function fromIndex(index: number): { row: number; col: number } {
  return { row: Math.floor(index / GRID_SIZE), col: index % GRID_SIZE };
}

/**
 * Converts 2D grid to flat Uint8Array
 */
export function gridToFlat(grid: number[][]): PuzzleFlat {
  const flat = new Uint8Array(CELL_COUNT);
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      flat[toIndex(row, col)] = grid[row]?.[col] ?? 0;
    }
  }
  return flat;
}

/**
 * Converts flat array to 2D grid
 */
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
