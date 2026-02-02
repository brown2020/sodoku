// Grid constants
export const GRID_SIZE = 9;
export const CELL_COUNT = GRID_SIZE * GRID_SIZE;
export const BOX_SIZE = 3;

// History limit to prevent memory leaks
export const MAX_HISTORY_SIZE = 500;

// Puzzle generation constraints
export const MAX_REMOVAL_RATIO = 0.7;
export const MIN_VISIBLE_CELLS = 20;

// Re-export difficulty from types for convenience
export type { Difficulty } from "@/types";
export { DIFFICULTY_SETTINGS } from "@/types";
