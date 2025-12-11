import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "@/store/useGameStore";
import SudokuCell from "./SudokuCell";

const SudokuGrid = memo(() => {
  // Group related state with useShallow for optimal re-renders
  const { puzzle, conflicts, initialPuzzle, selectedNumber } = useGameStore(
    useShallow((state) => ({
      puzzle: state.puzzle,
      conflicts: state.conflicts,
      initialPuzzle: state.initialPuzzle,
      selectedNumber: state.selectedNumber,
    }))
  );

  const { isComplete, isSolved } = useGameStore(
    useShallow((state) => ({
      isComplete: state.status.isComplete,
      isSolved: state.status.isSolved,
    }))
  );

  const setCellValue = useGameStore((state) => state.setCellValue);
  const selectNumber = useGameStore((state) => state.selectNumber);

  if (!puzzle || puzzle.length === 0) {
    return (
      <div className="w-full aspect-square flex items-center justify-center bg-slate-100 rounded-lg">
        <div className="animate-pulse text-slate-400">Loading puzzle...</div>
      </div>
    );
  }

  // Create 3x3 box structure for consistent borders
  const boxes = [];
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const cells = [];
      for (let cellRow = 0; cellRow < 3; cellRow++) {
        for (let cellCol = 0; cellCol < 3; cellCol++) {
          const rowIndex = boxRow * 3 + cellRow;
          const colIndex = boxCol * 3 + cellCol;
          const cell = puzzle[rowIndex][colIndex];

          cells.push(
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              rowIndex={rowIndex}
              colIndex={colIndex}
              conflict={conflicts[rowIndex][colIndex]}
              onChange={setCellValue}
              isComplete={isComplete}
              isSolved={isSolved}
              isOriginal={initialPuzzle[rowIndex][colIndex] !== 0}
              selectedNumber={selectedNumber}
              onCellClick={selectNumber}
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
    <div className="w-full max-w-md mx-auto bg-slate-800 p-0.5 rounded-lg shadow-xl">
      <div className="grid grid-cols-3 gap-0.5 bg-slate-800 rounded-lg overflow-hidden">
        {boxes}
      </div>
    </div>
  );
});

SudokuGrid.displayName = "SudokuGrid";

export default SudokuGrid;
