import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeConflicts,
  computeIncorrectCells,
  computeIsFilled,
  isSolved,
} from "./validation";

describe("computeConflicts", () => {
  it("marks duplicate digits in a row", () => {
    const puzzle = new Uint8Array(81);
    puzzle[0] = 5;
    puzzle[1] = 5;
    const conflicts = computeConflicts(puzzle);
    assert.equal(conflicts[0], 1);
    assert.equal(conflicts[1], 1);
  });

  it("leaves a valid empty board clean", () => {
    const conflicts = computeConflicts(new Uint8Array(81));
    assert.equal(conflicts.every((v) => v === 0), true);
  });
});

describe("isSolved / computeIsFilled / computeIncorrectCells", () => {
  it("detects filled and solved grids", () => {
    const solution = new Uint8Array(81);
    for (let i = 0; i < 81; i++) solution[i] = (i % 9) + 1;
    assert.equal(computeIsFilled(solution), true);
    assert.equal(isSolved(solution, solution), true);

    const wrong = solution.slice();
    wrong[0] = ((wrong[0] % 9) + 1) as number;
    assert.equal(isSolved(wrong, solution), false);
    const incorrect = computeIncorrectCells(wrong, solution);
    assert.equal(incorrect[0], 1);
  });

  it("treats zeros as not filled and not incorrect", () => {
    const solution = new Uint8Array(81);
    solution.fill(1);
    const puzzle = new Uint8Array(81);
    assert.equal(computeIsFilled(puzzle), false);
    const incorrect = computeIncorrectCells(puzzle, solution);
    assert.equal(incorrect.every((v) => v === 0), true);
  });
});
