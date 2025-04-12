// SodokuMain.tsx
"use client";

import { useEffect, memo } from "react";
import dynamic from "next/dynamic";
import useSudoku from "@/hooks/useSudoku";
import ErrorBoundary from "./ErrorBoundary";

// Dynamically import components with loading states
const ControlPanel = dynamic(() => import("./ControlPanel"), {
  loading: () => <div className="h-16 bg-gray-100 animate-pulse rounded-md" />,
});

const SudokuGrid = dynamic(() => import("./SudokuGrid"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-md" />,
});

// Stats component for game metrics
const GameStats = memo(
  ({ moveCount, timeElapsed }: { moveCount: number; timeElapsed: number }) => (
    <div className="flex justify-center gap-8 mt-4 text-gray-600">
      <div>Moves: {moveCount}</div>
      <div>
        Time: {Math.floor(timeElapsed / 60)}:
        {(timeElapsed % 60).toString().padStart(2, "0")}
      </div>
    </div>
  )
);

GameStats.displayName = "GameStats";

const SudokuMain = () => {
  const {
    puzzle,
    conflicts,
    gameState,
    stats,
    generateNewPuzzle,
    checkCompletion,
    undoMove,
    provideHint,
    solvePuzzle,
    downloadPdf,
    handleChange,
    difficulty,
    setDifficulty,
    initialPuzzle,
    selectedNumber,
    selectNumber,
  } = useSudoku();

  // Initialize game on mount
  useEffect(() => {
    generateNewPuzzle();
  }, [generateNewPuzzle]);

  // Handle cell click for number highlighting
  const handleCellClick = (number: number) => {
    // Toggle selection: if the same number is clicked again, deselect it
    selectNumber(selectedNumber === number ? null : number);
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl flex flex-col items-center min-h-screen py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
        Sudoku Challenge
      </h1>

      {/* Difficulty selector */}
      <div className="w-full max-w-[500px] flex justify-center mb-4">
        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as "easy" | "medium" | "hard")
          }
          className="px-4 py-2 rounded-sm border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div className="w-full max-w-[500px] px-4 mb-6">
        <ControlPanel
          generateNewPuzzle={generateNewPuzzle}
          checkCompletion={checkCompletion}
          undoMove={undoMove}
          provideHint={provideHint}
          solvePuzzle={solvePuzzle}
          downloadPdf={downloadPdf}
          isPuzzleFilled={gameState.isPuzzleFilled}
          isComplete={gameState.isComplete}
        />
      </div>

      {/* Grid wrapper with error boundary */}
      <ErrorBoundary
        fallback={
          <div>Something went wrong with the game board. Please refresh.</div>
        }
      >
        <div className="w-full perspective-1000">
          <SudokuGrid
            puzzle={puzzle}
            conflicts={conflicts}
            handleChange={handleChange}
            isComplete={gameState.isComplete}
            wasAutoSolved={gameState.usedSolver}
            initialPuzzle={initialPuzzle}
            selectedNumber={selectedNumber}
            onCellClick={handleCellClick}
          />
        </div>
      </ErrorBoundary>

      <div className="w-full max-w-[500px] px-4">
        <GameStats
          moveCount={stats.moveCount}
          timeElapsed={stats.timeElapsed}
        />
      </div>

      {/* Success message - only show for legitimate wins */}
      {gameState.isComplete && !gameState.usedSolver && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl transform transition-all max-w-sm w-full">
            <h2 className="text-xl md:text-2xl font-bold text-green-600 mb-4">
              Congratulations!
            </h2>
            <p className="mb-4">
              You completed the puzzle in {stats.moveCount} moves and{" "}
              {Math.floor(stats.timeElapsed / 60)}:
              {(stats.timeElapsed % 60).toString().padStart(2, "0")}!
            </p>
            <button
              onClick={() => generateNewPuzzle()}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition-colors"
            >
              New Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Add display name to the memo wrapper
const MemoizedSudokuMain = memo(SudokuMain);
MemoizedSudokuMain.displayName = "SudokuMain";

export default MemoizedSudokuMain;
