import { GRID_SIZE, CELL_COUNT } from "@/constants";
import { fromIndex } from "./gridConversion";

// Bits 1..9 set for all possible candidates
const FULL_NOTES_MASK = 0b1111111110;

/**
 * Computes "auto notes" (candidate pencil marks) for every empty cell.
 * Notes are returned as a flat 81-length bitmask array (bits 1..9 used).
 */
export function computeCandidateNotes(puzzle: ArrayLike<number>): Uint16Array {
  const rowUsed = new Uint16Array(GRID_SIZE);
  const colUsed = new Uint16Array(GRID_SIZE);
  const boxUsed = new Uint16Array(GRID_SIZE);

  // Pass 1: collect used digits per row/col/box
  for (let i = 0; i < CELL_COUNT; i++) {
    const value = puzzle[i] ?? 0;
    if (value === 0) continue;
    if (value < 1 || value > 9) continue;

    const { row, col } = fromIndex(i);
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    const bit = 1 << value;

    rowUsed[row] |= bit;
    colUsed[col] |= bit;
    boxUsed[box] |= bit;
  }

  // Pass 2: compute candidates for empties
  const notes = new Uint16Array(CELL_COUNT);
  for (let i = 0; i < CELL_COUNT; i++) {
    const value = puzzle[i] ?? 0;
    if (value !== 0) {
      notes[i] = 0;
      continue;
    }

    const { row, col } = fromIndex(i);
    const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    const used = rowUsed[row] | colUsed[col] | boxUsed[box];
    notes[i] = FULL_NOTES_MASK & ~used;
  }

  return notes;
}
