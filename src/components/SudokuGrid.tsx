import { memo } from "react";
import SudokuCell from "./SudokuCell";

const SudokuGrid = memo(() => {
  // Create 3x3 box structure for consistent borders
  const boxes = [];
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const cells = [];
      for (let cellRow = 0; cellRow < 3; cellRow++) {
        for (let cellCol = 0; cellCol < 3; cellCol++) {
          const rowIndex = boxRow * 3 + cellRow;
          const colIndex = boxCol * 3 + cellCol;

          cells.push(
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              rowIndex={rowIndex}
              colIndex={colIndex}
            />
          );
        }
      }
      boxes.push(
        <div
          key={`box-${boxRow}-${boxCol}`}
          className="grid grid-cols-3 gap-px bg-slate-400"
        >
          {cells}
        </div>
      );
    }
  }

  return (
    <div
      className="w-full max-w-md mx-auto bg-slate-800 p-0.5 rounded-lg shadow-xl"
      role="grid"
      aria-rowcount={9}
      aria-colcount={9}
    >
      <div className="grid grid-cols-3 gap-0.5 bg-slate-800 rounded-lg overflow-hidden">
        {boxes}
      </div>
    </div>
  );
});

SudokuGrid.displayName = "SudokuGrid";

export default SudokuGrid;
