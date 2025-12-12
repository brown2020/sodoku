import { memo, useCallback, type ChangeEvent, type ClipboardEvent } from "react";
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
      conflict,
      isOriginal,
      isComplete,
      isSolved,
      selectedNumber,
      setCellValue,
      selectNumber,
    } = useGameStore(
      useShallow((state) => ({
        value: state.puzzle[idx] ?? 0,
        conflict: (state.conflicts[idx] ?? 0) === 1,
        isOriginal: (state.initialPuzzle[idx] ?? 0) !== 0,
        isComplete: state.status.isComplete,
        isSolved: state.status.isSolved,
        selectedNumber: state.selectedNumber,
        setCellValue: state.setCellValue,
        selectNumber: state.selectNumber,
      }))
    );

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Allow clearing cell or digits 1-9
        if (inputValue === "") {
          setCellValue(rowIndex, colIndex, 0);
        } else if (/^[1-9]$/.test(inputValue)) {
          setCellValue(rowIndex, colIndex, parseInt(inputValue, 10));
        }
      },
      [setCellValue, rowIndex, colIndex]
    );

    const handleClick = useCallback(() => {
      if (value !== 0) {
        selectNumber(value === selectedNumber ? null : value);
      }
    }, [value, selectedNumber, selectNumber]);

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
          role="button"
          aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}, value ${value}`}
        >
          {value !== 0 ? value : ""}
        </div>
      );
    }

    return (
      <input
        type="tel"
        inputMode="numeric"
        pattern="[1-9]*"
        value={value !== 0 ? value : ""}
        onChange={handleChange}
        onClick={handleClick}
        onPaste={handlePaste}
        className={cn(baseStyles, stateStyles, "caret-transparent")}
        maxLength={1}
        autoComplete="off"
        aria-label={`Editable cell ${rowIndex + 1}, ${colIndex + 1}`}
      />
    );
  }
);

SudokuCell.displayName = "SudokuCell";

export default SudokuCell;
