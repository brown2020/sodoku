// SudokuCell.tsx
import React, { memo, useCallback, useEffect, useState } from "react";

interface SudokuCellProps {
  value: number;
  conflict: boolean;
  onChange: (value: string) => void;
  isComplete: boolean;
  wasAutoSolved: boolean;
  isOriginal: boolean;
}

const SudokuCell = memo(
  ({
    value,
    conflict,
    onChange,
    isComplete,
    wasAutoSolved,
    isOriginal,
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

    const cellClass = `
    w-full h-full
    aspect-square
    text-center
    text-[clamp(1rem,3vw,1.5rem)]
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-all duration-300
    ${animate ? "animate-number-enter" : ""}
    ${conflict ? "animate-mistake bg-red-200" : ""}
    ${
      wasAutoSolved
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "bg-white hover:bg-gray-50"
    }
    ${isOriginal ? "font-bold" : ""}
  `;

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
          disabled={isComplete}
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
