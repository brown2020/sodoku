"use client";

import { useEffect, memo, useRef, useId } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "@/store/useGameStore";
import SudokuGrid from "./SudokuGrid";
import ControlPanel from "./ControlPanel";
import { DIFFICULTY_SETTINGS, Difficulty } from "@/types";
import { cn, formatTime } from "@/lib/utils";

const DIFFICULTY_LEVELS = Object.keys(DIFFICULTY_SETTINGS) as Difficulty[];

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
    <div className="text-xl font-mono font-bold text-slate-700" role="timer">
      {formatTime(timeElapsed)}
    </div>
  );
});
GameTimer.displayName = "GameTimer";

const MoveCounter = memo(() => {
  const moveCount = useGameStore((state) => state.stats.moveCount);
  return (
    <div className="text-slate-600" role="status">
      Moves: <span className="font-bold text-slate-800">{moveCount}</span>
    </div>
  );
});
MoveCounter.displayName = "MoveCounter";

const BestTime = memo(() => {
  const difficulty = useGameStore((state) => state.difficulty);
  const best = useGameStore((state) => state.bestTimes[difficulty]);
  if (best == null) {
    return (
      <div className="text-sm text-slate-600" data-testid="best-time">
        Best: —
      </div>
    );
  }
  return (
    <div className="text-sm text-slate-600" data-testid="best-time">
      Best: <span className="font-semibold text-slate-800">{formatTime(best)}</span>
    </div>
  );
});
BestTime.displayName = "BestTime";

const DifficultySelector = memo(() => {
  const difficulty = useGameStore((state) => state.difficulty);
  const setDifficulty = useGameStore((state) => state.setDifficulty);

  return (
    <div className="flex justify-center mb-6" role="group" aria-label="Difficulty">
      <div className="inline-flex bg-slate-100 p-1 rounded-lg shadow-inner">
        {DIFFICULTY_LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setDifficulty(level)}
            aria-pressed={difficulty === level}
            data-testid={`difficulty-${level}`}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors duration-200",
              difficulty === level
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (hasWon) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [hasWon]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-0 m-auto max-w-sm w-[calc(100%-2rem)] rounded-xl border-0 bg-transparent p-0 shadow-2xl open:block backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      onCancel={(e) => {
        e.preventDefault();
        generateNewGame();
      }}
    >
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full text-center transform transition-transform duration-200 scale-100">
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
        <h2 id={titleId} className="text-2xl font-bold text-slate-800 mb-2">
          Puzzle Solved!
        </h2>
        <p id={descId} className="text-slate-600 mb-6">
          Great job! You finished in{" "}
          <span className="font-bold text-slate-800">{stats.moveCount}</span>{" "}
          moves and{" "}
          <span className="font-bold text-slate-800">
            {formatTime(stats.timeElapsed)}
          </span>
          .
        </p>
        <button
          type="button"
          onClick={generateNewGame}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Play Again
        </button>
      </div>
    </dialog>
  );
});
WinModal.displayName = "WinModal";

const SudokuMain = () => {
  const generateNewGame = useGameStore((state) => state.generateNewGame);
  const puzzleFilled = useGameStore((state) =>
    state.puzzle.some((v) => v !== 0)
  );
  const hydrated = useGameStore((state) => state._hasHydrated);
  const initialized = useRef(false);

  useEffect(() => {
    if (!hydrated || initialized.current) return;
    if (!puzzleFilled) {
      generateNewGame();
    }
    initialized.current = true;
  }, [generateNewGame, hydrated, puzzleFilled]);

  return (
    <main className="bg-slate-50 py-8 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            Sudoku
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Challenge your mind
          </p>
        </div>

        <DifficultySelector />

        <div className="w-full flex justify-between items-center max-w-md mb-4 px-2 gap-2">
          <MoveCounter />
          <BestTime />
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
