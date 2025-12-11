import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "@/store/useGameStore";
import SudokuCell from "./SudokuCell";
import { cn } from "@/lib/utils";

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

  return (
    <div className="w-full max-w-md mx-auto bg-slate-800 p-1 rounded-lg shadow-xl">
      <div className="grid grid-cols-9 gap-px bg-slate-800 border-2 border-slate-800 rounded-lg overflow-hidden">
        {puzzle.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            // Calculate borders for 3x3 grids
            const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex !== 8;
            const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  "aspect-square relative bg-white",
                  isRightBorder && "mr-[2px]",
                  isBottomBorder && "mb-[2px]"
                )}
              >
                <SudokuCell
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

SudokuGrid.displayName = "SudokuGrid";

export default SudokuGrid;
