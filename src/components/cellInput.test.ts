import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { digitFromText } from "./cellInput";

describe("digitFromText", () => {
  it("reads a single digit", () => {
    assert.equal(digitFromText("5"), 5);
  });

  it("uses the last digit so a filled cell can be replaced", () => {
    assert.equal(digitFromText("53"), 3);
    assert.equal(digitFromText(" 7 and 2 "), 2);
  });

  it("returns null when no sudoku digit is present", () => {
    assert.equal(digitFromText(""), null);
    assert.equal(digitFromText("0abc"), null);
  });
});
