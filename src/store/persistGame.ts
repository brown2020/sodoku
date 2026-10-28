import { createJSONStorage } from "zustand/middleware";
import type { Difficulty } from "@/types";

const DIFFICULTIES = ["easy", "medium", "hard"] as const satisfies readonly Difficulty[];

export function isDifficulty(value: unknown): value is Difficulty {
  return value === "easy" || value === "medium" || value === "hard";
}

/** Keep only finite, non-negative per-difficulty times. */
export function sanitizeBestTimes(
  value: unknown
): Partial<Record<Difficulty, number>> {
  if (!value || typeof value !== "object") return {};
  const record = value as Record<string, unknown>;
  const bestTimes: Partial<Record<Difficulty, number>> = {};
  for (const difficulty of DIFFICULTIES) {
    const time = record[difficulty];
    if (typeof time === "number" && Number.isFinite(time) && time >= 0) {
      bestTimes[difficulty] = Math.floor(time);
    }
  }
  return bestTimes;
}

/**
 * Merge stored prefs onto the in-memory store.
 * An empty read keeps the current state. Invalid shapes cannot replace
 * typed-array board fields or crash best-time rendering.
 */
export function mergePersistedGameState<
  T extends {
    difficulty: Difficulty;
    bestTimes: Partial<Record<Difficulty, number>>;
  },
>(persisted: unknown, current: T): T {
  if (!persisted || typeof persisted !== "object") return current;
  const record = persisted as Record<string, unknown>;
  return {
    ...current,
    difficulty: isDifficulty(record.difficulty)
      ? record.difficulty
      : current.difficulty,
    bestTimes: sanitizeBestTimes(record.bestTimes),
  };
}

/** localStorage adapter that no-ops when storage is missing or throws. */
export function createGameStorage() {
  return createJSONStorage(() => ({
    getItem: (name) => {
      try {
        return globalThis.localStorage?.getItem(name) ?? null;
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      try {
        globalThis.localStorage?.setItem(name, value);
      } catch {
        // Private mode and quota errors should not break a move.
      }
    },
    removeItem: (name) => {
      try {
        globalThis.localStorage?.removeItem(name);
      } catch {
        // Ignore storage failures.
      }
    },
  }));
}
