import { memo, useCallback, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface SudokuCellProps {
  value: number;
  rowIndex: number;
  colIndex: number;
  conflict: boolean;
  onChange: (row: number, col: number, value: number) => void;
  isComplete: boolean;
  isSolved: boolean;
  isOriginal: boolean;
  selectedNumber: number | null;
  onCellClick: (value: number | null) => void;
}

const SudokuCell = memo(
  ({
    value,
    rowIndex,
    colIndex,
    conflict,
    onChange,
    isComplete,
    isSolved,
    isOriginal,
    selectedNumber,
    onCellClick,
  }: SudokuCellProps) => {
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        // Allow clearing cell or digits 1-9
        if (inputValue === "") {
          onChange(rowIndex, colIndex, 0);
        } else if (/^[1-9]$/.test(inputValue)) {
          onChange(rowIndex, colIndex, parseInt(inputValue, 10));
        }
      },
      [onChange, rowIndex, colIndex]
    );

    const handleClick = useCallback(() => {
      if (value !== 0) {
        onCellClick(value === selectedNumber ? null : value);
      }
    }, [value, selectedNumber, onCellClick]);

    const isHighlighted = value !== 0 && value === selectedNumber;

    const baseStyles = cn(
      "w-full h-full flex items-center justify-center text-center transition-all duration-200 cursor-pointer select-none",
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
        type="text"
        inputMode="numeric"
        pattern="[1-9]*"
        value={value !== 0 ? value : ""}
        onChange={handleChange}
        onClick={handleClick}
        className={cn(baseStyles, stateStyles, "caret-transparent")}
        maxLength={1}
        aria-label={`Editable cell ${rowIndex + 1}, ${colIndex + 1}`}
      />
    );
  }
);

SudokuCell.displayName = "SudokuCell";

export default SudokuCell;
