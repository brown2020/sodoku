export interface CheckButtonState {
  label: "Check";
  disabled: boolean;
  /** The word Check stays on screen at every breakpoint. */
  labelClassName: string;
}

/**
 * Check is available for the whole game so mistakes can be marked before
 * the grid is full. It turns off once the puzzle is finished, and before
 * a game has started.
 */
export function getCheckButtonState(args: {
  isComplete: boolean;
  startTime: number;
}): CheckButtonState {
  const gameStarted = args.startTime > 0;
  return {
    label: "Check",
    disabled: args.isComplete || !gameStarted,
    labelClassName: "inline",
  };
}

/** Disabled controls keep a contrasting fill so the label stays readable. */
export const disabledControlClassName =
  "bg-slate-200 text-slate-700 cursor-not-allowed";
