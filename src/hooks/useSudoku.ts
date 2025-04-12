// useSudoku.ts
import { useState, useCallback, useRef, useEffect } from "react";
import { generatePdf } from "@/utils/generatePdf";
import {
  checkConflicts,
  generateFullGrid,
  removeNumbers,
} from "@/utils/sudokuUtils";

export type Difficulty = "easy" | "medium" | "hard";

const useSudoku = () => {
  // Refs for mutable state that doesn't need re-renders
  const solutionRef = useRef<number[][]>([]);
  const moveCountRef = useRef(0);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Main game state
  const [puzzle, setPuzzle] = useState<number[][]>([]);
  const [initialPuzzle, setInitialPuzzle] = useState<number[][]>([]);
  const [conflicts, setConflicts] = useState<boolean[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );
  const [history, setHistory] = useState<
    {
      puzzle: number[][];
      position: { row: number; col: number };
    }[]
  >([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  // Game settings and status
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameState, setGameState] = useState<{
    isPuzzleFilled: boolean;
    isComplete: boolean;
    timer: number;
    usedSolver: boolean;
  }>({
    isPuzzleFilled: false,
    isComplete: false,
    timer: 0,
    usedSolver: false,
  });

  const [stats, setStats] = useState({
    moveCount: 0,
    timeElapsed: 0,
  });

  // Timer effect
  useEffect(() => {
    if (startTimeRef.current && !gameState.isComplete) {
      timerRef.current = setInterval(() => {
        setStats((prev) => ({
          ...prev,
          timeElapsed: Math.floor((Date.now() - startTimeRef.current) / 1000),
        }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.isComplete]);

  const difficultySettings = useRef({
    easy: 40, // Remove 40 numbers (41 remain)
    medium: 50, // Remove 50 numbers (31 remain)
    hard: 60, // Remove 60 numbers (21 remain)
  });

  const generateNewPuzzle = useCallback(() => {
    // Generate the complete grid
    const fullGrid = generateFullGrid();
    solutionRef.current = fullGrid.map((row) => [...row]);

    // Create puzzle by removing numbers according to difficulty
    const numbersToRemove = difficultySettings.current[difficulty];
    const newPuzzle = removeNumbers(fullGrid, numbersToRemove);

    // Store initial state and reset game state
    setInitialPuzzle(newPuzzle.map((row) => [...row]));
    setPuzzle(newPuzzle);
    setConflicts(Array.from({ length: 9 }, () => Array(9).fill(false)));
    setHistory([]);
    setGameState({
      isPuzzleFilled: false,
      isComplete: false,
      timer: 0,
      usedSolver: false,
    });
    setStats({
      moveCount: 0,
      timeElapsed: 0,
    });

    moveCountRef.current = 0;
    startTimeRef.current = Date.now();

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [difficulty]);

  const handleChange = useCallback(
    (row: number, col: number, value: string) => {
      // Prevent changing original/fixed cells
      if (initialPuzzle[row][col] !== 0) {
        return;
      }

      const newValue = parseInt(value) || 0;
      if (newValue > 9) return;

      setPuzzle((currentPuzzle) => {
        const newPuzzle = currentPuzzle.map((r) => [...r]);
        newPuzzle[row][col] = newValue;

        // Check if puzzle is completely filled
        let isFilled = true;
        for (let i = 0; i < 9 && isFilled; i++) {
          for (let j = 0; j < 9; j++) {
            if (newPuzzle[i][j] === 0) {
              isFilled = false;
              break;
            }
          }
        }

        // Set conflicts and game state
        const newConflicts = checkConflicts(newPuzzle);
        setConflicts(newConflicts);
        setGameState((prev) => ({
          ...prev,
          isPuzzleFilled: isFilled,
        }));

        // Update history and stats
        setHistory((prev) => [
          ...prev,
          { puzzle: currentPuzzle.map((r) => [...r]), position: { row, col } },
        ]);

        moveCountRef.current++;
        setStats((prev) => ({
          ...prev,
          moveCount: moveCountRef.current,
        }));

        return newPuzzle;
      });
    },
    [initialPuzzle]
  );

  // checkCompletion function in useSudoku:
  const checkCompletion = useCallback(() => {
    // First verify puzzle is filled
    let isFilled = true;
    let hasErrors = false;
    const newConflicts = Array.from({ length: 9 }, () => Array(9).fill(false));

    // Check for empty cells and mark incorrect numbers
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzle[i][j] === 0) {
          isFilled = false;
        } else if (puzzle[i][j] !== solutionRef.current[i][j]) {
          newConflicts[i][j] = true;
          hasErrors = true;
        }
      }
    }

    if (!isFilled) {
      alert("Please fill in all cells before checking the solution.");
      return;
    }

    // Update conflicts to show mistakes
    setConflicts(newConflicts);

    if (!hasErrors) {
      setGameState((prev) => ({
        ...prev,
        isComplete: true,
        usedSolver: false,
      }));
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    // If there are errors, clear them after a delay
    if (hasErrors) {
      setTimeout(() => {
        setConflicts(Array.from({ length: 9 }, () => Array(9).fill(false)));
      }, 2000);
    }
  }, [puzzle]);

  const undoMove = useCallback(() => {
    if (history.length > 0) {
      const lastMove = history[history.length - 1];
      setPuzzle(lastMove.puzzle);
      setHistory((prev) => prev.slice(0, -1));
      setConflicts(checkConflicts(lastMove.puzzle));
      moveCountRef.current--;
      setStats((prev) => ({
        ...prev,
        moveCount: moveCountRef.current,
      }));

      // Recheck filled status after undo
      let isFilled = true;
      for (let i = 0; i < 9 && isFilled; i++) {
        for (let j = 0; j < 9; j++) {
          if (lastMove.puzzle[i][j] === 0) {
            isFilled = false;
            break;
          }
        }
      }
      setGameState((prev) => ({
        ...prev,
        isPuzzleFilled: isFilled,
      }));
    }
  }, [history]);

  const provideHint = useCallback(() => {
    if (gameState.isComplete) return;

    const emptyCells = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (puzzle[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      setPuzzle((prev) => {
        const newPuzzle = prev.map((r) => [...r]);
        newPuzzle[row][col] = solutionRef.current[row][col];
        return newPuzzle;
      });

      moveCountRef.current++;
      setStats((prev) => ({
        ...prev,
        moveCount: moveCountRef.current,
      }));
    }
  }, [puzzle, gameState.isComplete]);

  const solvePuzzle = useCallback(() => {
    setPuzzle(solutionRef.current.map((row) => [...row]));
    setConflicts(Array.from({ length: 9 }, () => Array(9).fill(false)));
    setGameState((prev) => ({
      ...prev,
      isPuzzleFilled: true,
      isComplete: true,
      usedSolver: true,
    }));
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const downloadPdf = useCallback(() => {
    generatePdf(puzzle);
  }, [puzzle]);

  const selectNumber = useCallback((number: number | null) => {
    setSelectedNumber(number);
  }, []);

  return {
    puzzle,
    conflicts,
    gameState,
    stats,
    difficulty,
    initialPuzzle,
    selectedNumber,
    generateNewPuzzle,
    handleChange,
    checkCompletion,
    undoMove,
    provideHint,
    solvePuzzle,
    downloadPdf,
    setDifficulty,
    selectNumber,
  };
};

export default useSudoku;
