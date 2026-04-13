/**
 * Game engine utilities - re-exports from focused modules
 */

// Grid conversion utilities
export { toIndex, fromIndex, gridToFlat, flatToGrid } from "./gridConversion";

// Validation utilities
export {
  computeConflicts,
  computeIncorrectCells,
  isSolved,
  computeIsFilled,
} from "./validation";

// Candidate computation
export { computeCandidateNotes } from "./candidates";
