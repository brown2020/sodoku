/**
 * Game engine utilities - re-exports from focused modules
 *
 * This file maintains backwards compatibility by re-exporting
 * all game engine functions from their respective modules.
 */

// Grid conversion utilities
export {
  toIndex,
  fromIndex,
  gridToFlat,
  flatToGrid,
  type PuzzleFlat,
} from "./gridConversion";

// Validation utilities
export {
  computeConflicts,
  computeIncorrectCells,
  isSolved,
  computeIsFilled,
  type ConflictsFlat,
} from "./validation";

// Candidate computation
export { computeCandidateNotes } from "./candidates";

// Re-export constants for backwards compatibility
export { GRID_SIZE, CELL_COUNT } from "@/constants";
