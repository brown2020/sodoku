import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mergePersistedGameState } from "./persistGame";

describe("mergePersistedGameState", () => {
  const current = {
    difficulty: "medium" as const,
    bestTimes: { easy: 12 },
    puzzle: new Uint8Array([4]),
  };

  it("keeps the current state when nothing was stored", () => {
    assert.equal(mergePersistedGameState(undefined, current), current);
    assert.equal(mergePersistedGameState(null, current), current);
  });

  it("accepts a known difficulty and finite best times", () => {
    const merged = mergePersistedGameState(
      { difficulty: "hard", bestTimes: { hard: 83.9, easy: -1, medium: "4" } },
      current
    );
    assert.equal(merged.difficulty, "hard");
    assert.deepEqual(merged.bestTimes, { hard: 83 });
    assert.equal(merged.puzzle[0], 4);
  });

  it("drops invalid prefs instead of replacing the live board", () => {
    const merged = mergePersistedGameState(
      { difficulty: "expert", bestTimes: null, puzzle: { 0: 9 } },
      current
    );
    assert.equal(merged.difficulty, "medium");
    assert.deepEqual(merged.bestTimes, {});
    assert.equal(merged.puzzle[0], 4);
  });
});
