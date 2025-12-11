"use client";

import { useEffect, memo, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "@/store/useGameStore";
import ErrorBoundary from "./ErrorBoundary";
import SudokuGrid from "./SudokuGrid";
import ControlPanel from "./ControlPanel";
import { DIFFICULTY_SETTINGS, Difficulty } from "@/types";
import { cn, formatTime } from "@/lib/utils";

// Derive difficulty levels from settings to avoid duplication
const DIFFICULTY_LEVELS = Object.keys(DIFFICULTY_SETTINGS) as Difficulty[];

// Timer Component to isolate re-renders
const GameTimer = memo(() => {
  const timeElapsed = useGameStore((state) => state.stats.timeElapsed);
  const updateTimer = useGameStore((state) => state.updateTimer);
  const isComplete = useGameStore((state) => state.status.isComplete);

  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [updateTimer, isComplete]);

  return (
    <div className="text-xl font-mono font-bold text-slate-700">
      {formatTime(timeElapsed)}
    </div>
  );
});
GameTimer.displayName = "GameTimer";

const MoveCounter = memo(() => {
  const moveCount = useGameStore((state) => state.stats.moveCount);
  return (
    <div className="text-slate-600">
      Moves: <span className="font-bold text-slate-800">{moveCount}</span>
    </div>
  );
});
MoveCounter.displayName = "MoveCounter";

const DifficultySelector = memo(() => {
  const difficulty = useGameStore((state) => state.difficulty);
  const setDifficulty = useGameStore((state) => state.setDifficulty);

  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex bg-slate-100 p-1 rounded-lg shadow-inner">
        {DIFFICULTY_LEVELS.map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium capitalize transition-all duration-200",
              difficulty === level
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
});
DifficultySelector.displayName = "DifficultySelector";

const WinModal = memo(() => {
  const { hasWon, stats } = useGameStore(
    useShallow((state) => ({
      hasWon: state.status.hasWon,
      stats: state.stats,
    }))
  );
  const generateNewGame = useGameStore((state) => state.generateNewGame);

  if (!hasWon) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4 transition-opacity duration-300 animate-fade-in">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center transform transition-all scale-100">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Puzzle Solved!
        </h2>
        <p className="text-slate-600 mb-6">
          Great job! You finished in{" "}
          <span className="font-bold text-slate-800">{stats.moveCount}</span>{" "}
          moves and{" "}
          <span className="font-bold text-slate-800">
            {formatTime(stats.timeElapsed)}
          </span>
          .
        </p>
        <button
          onClick={generateNewGame}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
        >
          Play Again
        </button>
      </div>
    </div>
  );
});
WinModal.displayName = "WinModal";

const SudokuMain = () => {
  const generateNewGame = useGameStore((state) => state.generateNewGame);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      generateNewGame();
      initialized.current = true;
    }
  }, [generateNewGame]);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Sudoku
          </h1>
          <p className="text-slate-500">Challenge your mind</p>
        </header>

        <DifficultySelector />

        <div className="w-full flex justify-between items-center max-w-md mb-4 px-2">
          <MoveCounter />
          <GameTimer />
        </div>

        <ErrorBoundary
          fallback={
            <div className="p-4 text-red-500 bg-red-50 rounded-lg">
              Something went wrong with the game board.
            </div>
          }
        >
          <div className="w-full mb-8">
            <SudokuGrid />
          </div>
        </ErrorBoundary>

        <ControlPanel />

        <WinModal />
      </div>
    </main>
  );
};

export default memo(SudokuMain);
