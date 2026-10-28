import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  disabledControlClassName,
  getCheckButtonState,
} from "./controlActions";

describe("getCheckButtonState", () => {
  it("stays enabled with a visible Check label during play", () => {
    const state = getCheckButtonState({ isComplete: false, startTime: 1_000 });
    assert.equal(state.disabled, false);
    assert.equal(state.label, "Check");
    assert.equal(state.labelClassName.includes("hidden"), false);
  });

  it("disables Check after the puzzle is finished", () => {
    const state = getCheckButtonState({ isComplete: true, startTime: 1_000 });
    assert.equal(state.disabled, true);
    assert.equal(state.label, "Check");
  });

  it("disables Check before a game exists", () => {
    const state = getCheckButtonState({ isComplete: false, startTime: 0 });
    assert.equal(state.disabled, true);
  });
});

describe("disabledControlClassName", () => {
  it("uses a dark label on a solid background", () => {
    assert.match(disabledControlClassName, /bg-slate-200/);
    assert.match(disabledControlClassName, /text-slate-700/);
    assert.equal(disabledControlClassName.includes("text-white"), false);
    assert.equal(disabledControlClassName.includes("opacity-50"), false);
  });
});
