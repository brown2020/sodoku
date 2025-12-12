import { memo, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";

const NumberPad = memo(() => {
  const { isNotesMode, selectedCellIdx } = useGameStore(
    useShallow((s) => ({
      isNotesMode: s.isNotesMode,
      selectedCellIdx: s.selectedCellIdx,
    }))
  );

  const inputNumber = useGameStore((s) => s.inputNumber);
  const eraseSelectedCell = useGameStore((s) => s.eraseSelectedCell);

  const onPress = useCallback(
    (n: number) => {
      inputNumber(n);
    },
    [inputNumber]
  );

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="flex items-center justify-between mb-2 text-sm text-slate-600">
        <div>
          Mode:{" "}
          <span className="font-semibold text-slate-800">
            {isNotesMode ? "Notes" : "Number"}
          </span>
        </div>
        <div className="text-xs text-slate-500">
          {selectedCellIdx == null ? "Select a cell" : "Cell selected"}
        </div>
      </div>

      <div className="grid grid-cols-9 gap-2">
        {Array.from({ length: 9 }, (_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onPress(n)}
              className={cn(
                "h-10 rounded-lg bg-white border border-slate-200 shadow-sm font-semibold text-slate-800",
                "hover:bg-slate-50 active:scale-95 transition",
                "focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              )}
              aria-label={`Enter ${n}`}
            >
              {n}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={eraseSelectedCell}
        className={cn(
          "mt-3 w-full h-10 rounded-lg border border-slate-200 bg-white shadow-sm",
          "text-slate-700 font-medium hover:bg-slate-50 active:scale-[0.99] transition",
          "focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        )}
      >
        Erase
      </button>
    </div>
  );
});

NumberPad.displayName = "NumberPad";

export default NumberPad;


