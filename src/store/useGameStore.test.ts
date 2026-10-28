import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { useGameStore } from "./useGameStore";

class MemoryStorage {
  readonly map = new Map<string, string>();
  failReads = false;
  failWrites = false;

  getItem(key: string): string | null {
    if (this.failReads) throw new Error("storage blocked");
    return this.map.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    if (this.failWrites) throw new DOMException("QuotaExceededError");
    this.map.set(key, value);
  }

  removeItem(key: string) {
    this.map.delete(key);
  }
}

const storage = new MemoryStorage();

function installStorage() {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: storage,
  });
}

function fillWithSolution() {
  const { puzzle, solution, setCellValue } = useGameStore.getState();
  for (let i = 0; i < puzzle.length; i++) {
    if (puzzle[i] !== 0) continue;
    setCellValue(Math.floor(i / 9), i % 9, solution[i] ?? 0);
  }
}

describe("useGameStore", () => {
  afterEach(() => {
    storage.map.clear();
    storage.failReads = false;
    storage.failWrites = false;
    installStorage();
  });

  it("records the real elapsed time when the puzzle is solved", () => {
    installStorage();
    const store = useGameStore.getState();
    store.generateNewGame();
    const startTime = Date.now() - 125_000;
    useGameStore.setState({
      stats: { ...useGameStore.getState().stats, startTime, timeElapsed: 3 },
    });
    fillWithSolution();
    const finished = useGameStore.getState();
    assert.equal(finished.status.hasWon, true);
    assert.ok(finished.stats.timeElapsed >= 125);
    assert.ok(finished.stats.timeElapsed <= 126);
    assert.equal(
      finished.bestTimes[finished.difficulty],
      finished.stats.timeElapsed
    );
  });

  it("toggles auto notes and restores the previous mask on undo", () => {
    installStorage();
    const store = useGameStore.getState();
    store.generateNewGame();
    store.autoFillNotes();
    assert.equal(useGameStore.getState().areNotesAuto, true);

    const { puzzle, notes, toggleNote, undoMove } = useGameStore.getState();
    const idx = puzzle.findIndex((value) => value === 0);
    const before = notes[idx] ?? 0;
    toggleNote(Math.floor(idx / 9), idx % 9, 1);
    const toggled = useGameStore.getState().notes[idx];
    assert.notEqual(toggled, before);

    undoMove();
    assert.equal(useGameStore.getState().notes[idx], before);

    useGameStore.getState().autoFillNotes();
    assert.equal(useGameStore.getState().areNotesAuto, false);
    const kept = useGameStore.getState().notes[idx] ?? 0;
    const other = puzzle.findIndex((value, index) => value === 0 && index !== idx);
    const solution = useGameStore.getState().solution[other] ?? 1;
    useGameStore
      .getState()
      .setCellValue(Math.floor(other / 9), other % 9, solution === 1 ? 2 : 1);
    assert.equal(useGameStore.getState().notes[idx], kept);
  });

  it("hydrates invalid storage without throwing and still accepts moves", async () => {
    installStorage();
    storage.map.set("sodoku-storage", "{");
    await useGameStore.persist.rehydrate();
    assert.equal(useGameStore.getState()._hasHydrated, true);

    storage.map.set(
      "sodoku-storage",
      JSON.stringify({
        state: { difficulty: "easy", bestTimes: null, puzzle: { 0: 8 } },
        version: 0,
      })
    );
    await useGameStore.persist.rehydrate();
    const state = useGameStore.getState();
    assert.equal(state.difficulty, "easy");
    assert.deepEqual(state.bestTimes, {});
    assert.equal(state.puzzle instanceof Uint8Array, true);

    storage.failWrites = true;
    assert.doesNotThrow(() => useGameStore.getState().setDifficulty("medium"));
    assert.equal(useGameStore.getState().difficulty, "medium");

    storage.failWrites = false;
    storage.failReads = true;
    await useGameStore.persist.rehydrate();
    assert.equal(useGameStore.getState()._hasHydrated, true);
  });
});
