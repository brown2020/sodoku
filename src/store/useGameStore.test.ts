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

  it("checks mistakes before the grid is full", () => {
    installStorage();
    useGameStore.getState().generateNewGame();
    const { puzzle, solution, setCellValue, checkCompletion } =
      useGameStore.getState();
    const idx = puzzle.findIndex((value) => value === 0);
    const correct = solution[idx] ?? 1;
    const wrong = correct === 1 ? 2 : 1;
    setCellValue(Math.floor(idx / 9), idx % 9, wrong);
    checkCompletion();
    const checked = useGameStore.getState();
    assert.equal(checked.status.isComplete, false);
    assert.equal(checked.checkHighlights[idx], 1);
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

  it("plays from the number pad through hint and solve", () => {
    installStorage();
    useGameStore.getState().generateNewGame();
    const started = useGameStore.getState();
    const givenIdx = started.initialPuzzle.findIndex((value) => value !== 0);
    const emptyIdx = started.puzzle.findIndex((value) => value === 0);
    assert.ok(givenIdx >= 0);
    assert.ok(emptyIdx >= 0);

    useGameStore.getState().setSelectedCellIdx(givenIdx);
    useGameStore.getState().inputNumber(9);
    assert.equal(
      useGameStore.getState().puzzle[givenIdx],
      started.initialPuzzle[givenIdx]
    );

    useGameStore.getState().setSelectedCellIdx(emptyIdx);
    useGameStore.getState().toggleNotesMode();
    useGameStore.getState().inputNumber(3);
    assert.ok((useGameStore.getState().notes[emptyIdx] ?? 0) & (1 << 3));

    useGameStore.getState().toggleNotesMode();
    const solutionDigit = started.solution[emptyIdx] ?? 0;
    useGameStore.getState().inputNumber(solutionDigit);
    assert.equal(useGameStore.getState().puzzle[emptyIdx], solutionDigit);
    assert.equal(useGameStore.getState().notes[emptyIdx], 0);

    useGameStore.getState().undoMove();
    assert.equal(useGameStore.getState().puzzle[emptyIdx], 0);
    assert.ok((useGameStore.getState().notes[emptyIdx] ?? 0) & (1 << 3));

    const beforeHint = useGameStore.getState().puzzle.slice();
    useGameStore.getState().provideHint();
    const hinted = useGameStore.getState();
    const hintedIdx = [...hinted.puzzle].findIndex(
      (value, index) => value !== beforeHint[index]
    );
    assert.ok(hintedIdx >= 0);
    assert.equal(hinted.puzzle[hintedIdx], hinted.solution[hintedIdx]);

    useGameStore.getState().solveGame();
    const solved = useGameStore.getState();
    assert.deepEqual([...solved.puzzle], [...solved.solution]);
    assert.equal(solved.status.isComplete, true);
    assert.equal(solved.status.isSolved, true);
    assert.equal(solved.status.hasWon, false);
    solved.checkCompletion();
    assert.equal(useGameStore.getState().status.hasWon, false);
    assert.equal(useGameStore.getState().puzzle[emptyIdx], solutionDigit);
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
