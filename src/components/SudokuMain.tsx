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
  } = useSudoku();

  // Initialize game on mount
  useEffect(() => {
    generateNewPuzzle();
  }, [generateNewPuzzle]);

  // Performance optimization: Use CSS transforms for animations
  const containerClass = `
    p-4 max-w-4xl mx-auto
    transform-gpu 
    ${gameState.isComplete && !gameState.usedSolver ? "animate-success" : ""}
  `;

  return (
    <div className={containerClass}>
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Sudoku Challenge
      </h1>

      {/* Difficulty selector */}
      <div className="flex justify-center mb-4">
        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(e.target.value as "easy" | "medium" | "hard")
          }
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

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

      {/* Grid wrapper with error boundary */}
      <ErrorBoundary
        fallback={
          <div>Something went wrong with the game board. Please refresh.</div>
        }
      >
        <div className="perspective-1000">
          <SudokuGrid
            puzzle={puzzle}
            conflicts={conflicts}
            handleChange={handleChange}
            isComplete={gameState.isComplete}
            wasAutoSolved={gameState.usedSolver}
            initialPuzzle={initialPuzzle}
          />
        </div>
      </ErrorBoundary>

      <GameStats moveCount={stats.moveCount} timeElapsed={stats.timeElapsed} />

      {/* Success message - only show for legitimate wins */}
      {gameState.isComplete && !gameState.usedSolver && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl transform transition-all">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Congratulations!
            </h2>
            <p className="mb-4">
              You completed the puzzle in {stats.moveCount} moves and{" "}
              {Math.floor(stats.timeElapsed / 60)}:
              {(stats.timeElapsed % 60).toString().padStart(2, "0")}!
            </p>
            <button
              onClick={() => generateNewPuzzle()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
