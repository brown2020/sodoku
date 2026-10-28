import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { elapsedSeconds, formatTime } from "./utils";

describe("elapsedSeconds", () => {
  it("returns 0 before the clock starts", () => {
    assert.equal(elapsedSeconds(0, 10_000), 0);
  });

  it("counts whole seconds from the start time", () => {
    assert.equal(elapsedSeconds(1_000, 126_000), 125);
  });
});

describe("formatTime", () => {
  it("pads seconds", () => {
    assert.equal(formatTime(83), "1:23");
  });
});
