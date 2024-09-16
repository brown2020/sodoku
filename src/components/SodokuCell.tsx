import React from "react";

interface SudokuCellProps {
  value: number;
  conflict: boolean;
  onChange: (value: string) => void;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  value,
  conflict,
  onChange,
}) => {
  return (
    <input
      type="text"
      value={value !== 0 ? value : ""}
      onChange={(e) => onChange(e.target.value)}
      className={`w-12 h-12 text-center text-xl flex items-center justify-center outline-none appearance-none ${
        conflict ? "bg-red-200" : "bg-white" // Red background for cells with conflicts
      }`}
      inputMode="numeric"
      pattern="[1-9]*"
    />
  );
};

export default SudokuCell;
