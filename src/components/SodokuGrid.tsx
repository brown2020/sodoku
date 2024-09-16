import React from "react";
import SudokuCell from "./SodokuCell";

interface SudokuGridProps {
  puzzle: number[][];
  conflicts: boolean[][];
  handleChange: (row: number, col: number, value: string) => void;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
  puzzle,
  conflicts,
  handleChange,
}) => {
  const getBorderStyle = (row: number, col: number): React.CSSProperties => {
    const styles: React.CSSProperties = {
      border: "1px solid #374151", // Default border
    };

    // Apply thicker borders for 3x3 subgrids
    if (row % 3 === 0 && row !== 0) styles.borderTop = "2px solid #374151"; // Thicker top border
    if (col % 3 === 0 && col !== 0) styles.borderLeft = "2px solid #374151"; // Thicker left border

    // Apply thicker borders for the outer edges
    if (row === 0) styles.borderTop = "2px solid #374151";
    if (col === 0) styles.borderLeft = "2px solid #374151";
    if (row === 8) styles.borderBottom = "2px solid #374151";
    if (col === 8) styles.borderRight = "2px solid #374151";

    return styles;
  };

  return (
    <table className="border-collapse mx-auto">
      <tbody>
        {puzzle.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex} style={getBorderStyle(rowIndex, colIndex)}>
                <SudokuCell
                  value={cell}
                  conflict={conflicts[rowIndex][colIndex]} // Pass conflict state to each cell
                  onChange={(value: string) =>
                    handleChange(rowIndex, colIndex, value)
                  } // Explicitly type 'value' as 'string'
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SudokuGrid;
