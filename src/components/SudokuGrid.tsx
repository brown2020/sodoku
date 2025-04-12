// SudokuGrid.tsx
import React, { memo } from "react";
import SudokuCell from "./SudokuCell";

interface SudokuGridProps {
  puzzle: number[][];
  conflicts: boolean[][];
  handleChange: (row: number, col: number, value: string) => void;
  isComplete: boolean;
  wasAutoSolved: boolean;
  initialPuzzle: number[][];
  selectedNumber: number | null;
  onCellClick: (value: number) => void;
}

const SudokuGrid = memo(
  ({
    puzzle,
    conflicts,
    handleChange,
    isComplete,
    wasAutoSolved,
    initialPuzzle,
    selectedNumber,
    onCellClick,
  }: SudokuGridProps) => {
    const getBorderStyle = (row: number, col: number): React.CSSProperties => {
      const styles: React.CSSProperties = {
        border: "1px solid #374151",
      };

      if (row % 3 === 0 && row !== 0) styles.borderTop = "2px solid #374151";
      if (col % 3 === 0 && col !== 0) styles.borderLeft = "2px solid #374151";
      if (row === 0) styles.borderTop = "2px solid #374151";
      if (col === 0) styles.borderLeft = "2px solid #374151";
      if (row === 8) styles.borderBottom = "2px solid #374151";
      if (col === 8) styles.borderRight = "2px solid #374151";

      return styles;
    };

    return (
      <div className="w-full max-w-[500px] mx-auto px-4 overflow-auto">
        <table className="border-collapse mx-auto w-full aspect-square">
          <tbody>
            {puzzle.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    style={getBorderStyle(rowIndex, colIndex)}
                    className="relative p-0"
                  >
                    <SudokuCell
                      value={cell}
                      conflict={conflicts[rowIndex][colIndex]}
                      onChange={(value: string) =>
                        handleChange(rowIndex, colIndex, value)
                      }
                      isComplete={isComplete}
                      wasAutoSolved={
                        wasAutoSolved && initialPuzzle[rowIndex][colIndex] === 0
                      }
                      isOriginal={initialPuzzle[rowIndex][colIndex] !== 0}
                      selectedNumber={selectedNumber}
                      onCellClick={onCellClick}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

SudokuGrid.displayName = "SudokuGrid";

export default SudokuGrid;
