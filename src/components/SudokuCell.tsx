// SudokuCell.tsx
import React, { memo, useCallback } from "react";

interface SudokuCellProps {
  value: number;
  conflict: boolean;
  onChange: (value: string) => void;
  isComplete: boolean;
  wasAutoSolved: boolean;
  isOriginal: boolean;
  selectedNumber: number | null;
  onCellClick: (value: number) => void;
}

const SudokuCell = memo(
  ({
    value,
    conflict,
    onChange,
    isComplete,
    wasAutoSolved,
    isOriginal,
    selectedNumber,
    onCellClick,
  }: SudokuCellProps) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "" || /^[1-9]$/.test(value)) {
          onChange(value);
        }
      },
      [onChange]
    );

    const handleClick = useCallback(() => {
      if (value !== 0) {
        onCellClick(value);
      }
    }, [value, onCellClick]);

    const isHighlighted = value !== 0 && value === selectedNumber;

    const cellClass = `
      w-full h-full
      aspect-square
      flex items-center justify-center
      text-center
      text-[clamp(1rem,3vw,1.5rem)]
      focus:outline-hidden focus:ring-2 focus:ring-blue-500
      transition-all duration-300
      ${conflict ? "bg-red-200" : ""}
      ${
        isHighlighted
          ? "bg-green-500 text-white"
          : wasAutoSolved
          ? "bg-blue-100 text-blue-700 font-semibold"
          : isOriginal
          ? "bg-gray-100 text-gray-800"
          : "bg-white hover:bg-gray-50"
      }
      ${isOriginal ? "font-bold" : ""}
      cursor-pointer
    `;

    // For original cells or completed game, use div
    if (isOriginal || isComplete) {
      return (
        <div className={cellClass} onClick={handleClick}>
          {value !== 0 ? value : ""}
        </div>
      );
    }

    // For editable cells, use input
    return (
      <div className="relative w-full h-full">
        <input
          type="text"
          inputMode="numeric"
          pattern="[1-9]*"
          value={value !== 0 ? value : ""}
          onChange={handleChange}
          className={cellClass}
          maxLength={1}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        />
      </div>
    );
  }
);

SudokuCell.displayName = "SudokuCell";

export default SudokuCell;
