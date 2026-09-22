import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fromIndex, gridToFlat, toIndex } from "./gridConversion";

describe("gridConversion", () => {
  it("round-trips index ↔ row/col", () => {
    assert.deepEqual(fromIndex(0), { row: 0, col: 0 });
    assert.deepEqual(fromIndex(80), { row: 8, col: 8 });
    assert.equal(toIndex(3, 4), 31);
  });

  it("flattens a 9x9 grid row-major", () => {
    const grid = Array.from({ length: 9 }, (_, r) =>
      Array.from({ length: 9 }, (_, c) => r * 9 + c + 1)
    );
    const flat = gridToFlat(grid);
    assert.equal(flat.length, 81);
    assert.equal(flat[0], 1);
    assert.equal(flat[80], 81);
  });
});
