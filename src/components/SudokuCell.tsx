import {
  memo,
  useCallback,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { toIndex } from "@/utils/gameEngine";

interface SudokuCellProps {
  rowIndex: number;
  colIndex: number;
}

const SudokuCell = memo(
  ({ rowIndex, colIndex }: SudokuCellProps) => {
    const idx = toIndex(rowIndex, colIndex);
    const {
      value,
      notesMask,
      conflict,
      isOriginal,
      isComplete,
      isSolved,
      isNotesMode,
      selectedNumber,
      selectedCellIdx,
      setCellValue,
      selectNumber,
      setSelectedCellIdx,
      toggleNote,
    } = useGameStore(
      useShallow((state) => ({
        value: state.puzzle[idx] ?? 0,
        notesMask: state.notes[idx] ?? 0,
        conflict:
          (state.ruleConflicts[idx] ?? 0) === 1 ||
          (state.checkHighlights[idx] ?? 0) === 1 ||
          (state.incorrectHighlights[idx] ?? 0) === 1,
        isOriginal: (state.initialPuzzle[idx] ?? 0) !== 0,
        isComplete: state.status.isComplete,
        isSolved: state.status.isSolved,
        isNotesMode: state.isNotesMode,
        selectedNumber: state.selectedNumber,
        selectedCellIdx: state.selectedCellIdx,
        setCellValue: state.setCellValue,
        selectNumber: state.selectNumber,
        setSelectedCellIdx: state.setSelectedCellIdx,
        toggleNote: state.toggleNote,
      }))
    );

    const isSelectedCell = selectedCellIdx === idx;
    const isPeerHighlighted =
      selectedCellIdx != null &&
      (Math.floor(selectedCellIdx / 9) === rowIndex ||
        selectedCellIdx % 9 === colIndex ||
        (Math.floor(selectedCellIdx / 27) === Math.floor(rowIndex / 3) &&
          Math.floor((selectedCellIdx % 9) / 3) === Math.floor(colIndex / 3)));

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Allow clearing cell or digits 1-9
        if (inputValue === "") {
          setCellValue(rowIndex, colIndex, 0);
        } else if (/^[1-9]$/.test(inputValue)) {
          const n = parseInt(inputValue, 10);
          if (isNotesMode) {
            toggleNote(rowIndex, colIndex, n);
          } else {
            setCellValue(rowIndex, colIndex, n);
          }
        }
      },
      [setCellValue, toggleNote, isNotesMode, rowIndex, colIndex]
    );

    const handleClick = useCallback(() => {
      setSelectedCellIdx(idx);
      if (value === 0) {
        selectNumber(null);
        return;
      }
      selectNumber(value === selectedNumber ? null : value);
    }, [idx, setSelectedCellIdx, value, selectedNumber, selectNumber]);

    const handleFocus = useCallback(() => {
      setSelectedCellIdx(idx);
    }, [idx, setSelectedCellIdx]);

    const focusCell = useCallback((nextRow: number, nextCol: number) => {
      const r = Math.max(0, Math.min(8, nextRow));
      const c = Math.max(0, Math.min(8, nextCol));
      const nextIdx = toIndex(r, c);
      const el = document.querySelector<HTMLElement>(`[data-cell="${nextIdx}"]`);
      el?.focus();
    }, []);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLElement>) => {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            focusCell(rowIndex - 1, colIndex);
            return;
          case "ArrowDown":
            e.preventDefault();
            focusCell(rowIndex + 1, colIndex);
            return;
          case "ArrowLeft":
            e.preventDefault();
            focusCell(rowIndex, colIndex - 1);
            return;
          case "ArrowRight":
            e.preventDefault();
            focusCell(rowIndex, colIndex + 1);
            return;
          default:
            return;
        }
      },
      [rowIndex, colIndex, focusCell]
    );

    const handlePaste = useCallback(
      (e: ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData("text").trim();
        const match = text.match(/[1-9]/);
        if (!match) return;
        e.preventDefault();
        setCellValue(rowIndex, colIndex, parseInt(match[0], 10));
      },
      [setCellValue, rowIndex, colIndex]
    );

    const isHighlighted = value !== 0 && value === selectedNumber;

    const baseStyles = cn(
      "aspect-square w-full h-full flex items-center justify-center text-center transition-all duration-200 cursor-pointer select-none",
      "text-lg sm:text-xl md:text-2xl font-medium",
      "focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-inset z-10"
    );

    const stateStyles = cn(
      conflict && "bg-red-100 text-red-600",
      !conflict && isSelectedCell && "bg-slate-200",
      !conflict && !isSelectedCell && isPeerHighlighted && "bg-slate-50",
      !conflict && isHighlighted && "bg-blue-500 text-white",
      !conflict && !isHighlighted && isSolved && "text-blue-600 bg-blue-50",
      !conflict &&
        !isHighlighted &&
        isOriginal &&
        "bg-slate-100 font-bold text-slate-900",
      !conflict &&
        !isHighlighted &&
        !isOriginal &&
        !isSolved &&
        "bg-white hover:bg-slate-50 text-slate-700"
    );

    if (isOriginal || isComplete) {
      return (
        <div
          className={cn(baseStyles, stateStyles)}
          onClick={handleClick}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          data-cell={idx}
          aria-invalid={conflict || undefined}
          aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}, value ${value}`}
        >
          {value !== 0 ? value : ""}
        </div>
      );
    }

    const showNotes = value === 0 && notesMask !== 0;

    return (
      <div className={cn(baseStyles, stateStyles, "relative")}>
        {showNotes ? (
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-1 text-[10px] leading-none text-slate-500">
            {Array.from({ length: 9 }, (_, i) => {
              const n = i + 1;
              const bit = 1 << n;
              return (
                <div key={n} className="flex items-center justify-center">
                  {notesMask & bit ? n : ""}
                </div>
              );
            })}
          </div>
        ) : null}

        <input
          type="tel"
          inputMode="numeric"
          pattern="[1-9]*"
          value={value !== 0 ? value : ""}
          onChange={handleChange}
          onClick={handleClick}
          onFocus={handleFocus}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          className={cn(
            "absolute inset-0 w-full h-full bg-transparent text-inherit text-center",
            "caret-transparent"
          )}
          maxLength={1}
          autoComplete="off"
          data-cell={idx}
          aria-invalid={conflict || undefined}
          aria-label={`Editable cell ${rowIndex + 1}, ${colIndex + 1}`}
        />
      </div>
    );
  }
);

SudokuCell.displayName = "SudokuCell";

export default SudokuCell;
