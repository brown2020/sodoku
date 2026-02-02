"use client";

import { useEffect, memo, useRef, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "@/store/useGameStore";
import SudokuGrid from "./SudokuGrid";
import ControlPanel from "./ControlPanel";
import { DIFFICULTY_SETTINGS, Difficulty } from "@/types";
import { cn, formatTime } from "@/lib/utils";

// Derive difficulty levels from settings to avoid duplication
const DIFFICULTY_LEVELS = Object.keys(DIFFICULTY_SETTINGS) as Difficulty[];

// Timer Component to isolate re-renders
const GameTimer = memo(() => {
  const timeElapsed = useGameStore((state) => state.stats.timeElapsed);
  const isComplete = useGameStore((state) => state.status.isComplete);

  useEffect(() => {
    if (isComplete) return;
    const interval = setInterval(() => {
      useGameStore.getState().updateTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [isComplete]);

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
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle escape key to close modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        generateNewGame();
      }
    },
    [generateNewGame]
  );

  // Focus trap and keyboard handling
  useEffect(() => {
    if (hasWon) {
      // Focus the button when modal opens
      buttonRef.current?.focus();

      // Add escape key listener
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [hasWon, handleKeyDown]);

  if (!hasWon) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 px-4 transition-opacity duration-300 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-modal-title"
      aria-describedby="win-modal-description"
    >
      <div
        ref={modalRef}
        className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center transform transition-all scale-100"
      >
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2
          id="win-modal-title"
          className="text-2xl font-bold text-slate-800 mb-2"
        >
          Puzzle Solved!
        </h2>
        <p id="win-modal-description" className="text-slate-600 mb-6">
          Great job! You finished in{" "}
          <span className="font-bold text-slate-800">{stats.moveCount}</span>{" "}
          moves and{" "}
          <span className="font-bold text-slate-800">
            {formatTime(stats.timeElapsed)}
          </span>
          .
        </p>
        <button
          ref={buttonRef}
          onClick={generateNewGame}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
    <main className="bg-slate-50 py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="text-center mb-6">
          <p className="text-sm sm:text-base text-slate-500">
            Challenge your mind
          </p>
        </div>

        <DifficultySelector />

        <div className="w-full flex justify-between items-center max-w-md mb-4 px-2">
          <MoveCounter />
          <GameTimer />
        </div>

        <div className="w-full mb-8">
          <SudokuGrid />
        </div>

        <ControlPanel />

        <WinModal />
      </div>
    </main>
  );
};

export default memo(SudokuMain);
