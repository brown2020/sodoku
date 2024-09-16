"use client";

import { useEffect } from "react";
import ControlPanel from "./ControlPanel";
import useSudoku from "@/hooks/useSodoku";
import SudokuGrid from "./SodokuGrid";

export default function SudokuMain() {
  const {
    puzzle,
    conflicts,
    generateNewPuzzle,
    checkCompletion,
    undoMove,
    provideHint,
    solvePuzzle,
    downloadPdf,
    isPuzzleFilled,
    handleChange,
  } = useSudoku(); // Use the custom hook to get all the necessary functions and states

  // Ensure a new game is created when the component mounts
  useEffect(() => {
    generateNewPuzzle();
  }, [generateNewPuzzle]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Sudoku Game</h1>
      <ControlPanel
        generateNewPuzzle={generateNewPuzzle}
        checkCompletion={checkCompletion}
        undoMove={undoMove}
        provideHint={provideHint}
        solvePuzzle={solvePuzzle}
        downloadPdf={downloadPdf}
        isPuzzleFilled={isPuzzleFilled}
      />
      <SudokuGrid
        puzzle={puzzle}
        conflicts={conflicts}
        handleChange={handleChange}
      />
    </div>
  );
}
