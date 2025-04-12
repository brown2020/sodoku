// SudokuCell.tsx
import React, { memo, useCallback, useEffect, useState } from "react";

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
    const [animate, setAnimate] = useState(false);
    const [prevValue, setPrevValue] = useState(value);

    useEffect(() => {
      if (value !== prevValue) {
        setAnimate(true);
        setPrevValue(value);
        const timer = setTimeout(() => setAnimate(false), 300);
        return () => clearTimeout(timer);
      }
    }, [value, prevValue]);

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
    text-center
    text-[clamp(1rem,3vw,1.5rem)]
    focus:outline-hidden focus:ring-2 focus:ring-blue-500
    transition-all duration-300
    ${animate ? "animate-number-enter" : ""}
    ${conflict ? "animate-mistake bg-red-200" : ""}
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

    // Use a non-input element for original cells to avoid input-related issues
    if (isOriginal) {
      return (
        <div className={`relative w-full h-full`} onClick={handleClick}>
          <div className={`${cellClass} flex items-center justify-center`}>
            {value !== 0 ? value : ""}
          </div>
          {animate && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="animate-circle-out absolute inset-0 bg-blue-500/10 rounded-full" />
            </div>
          )}
        </div>
      );
    }

    // For editable cells, use the input element
    return (
      <div className="relative w-full h-full" onClick={handleClick}>
        <input
          type="text"
          inputMode="numeric"
          pattern="[1-9]*"
          value={value !== 0 ? value : ""}
          onChange={handleChange}
          className={cellClass}
          maxLength={1}
          disabled={isComplete}
          onClick={(e) => {
            // Prevent event bubbling on the input
            e.stopPropagation();
            handleClick();
          }}
        />
        {animate && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="animate-circle-out absolute inset-0 bg-blue-500/10 rounded-full" />
          </div>
        )}
      </div>
    );
  }
);

SudokuCell.displayName = "SudokuCell";

export default SudokuCell;
