import { generatePdf } from "@/utils/generatePdf";
import {
  checkConflicts,
  generateFullGrid,
  removeNumbers,
} from "@/utils/sodokuUtils";
import { useState, useCallback } from "react";

const useSudoku = () => {
  // State for the puzzle, conflicts, and history for undo
  const [puzzle, setPuzzle] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [conflicts, setConflicts] = useState<boolean[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );
  const [history, setHistory] = useState<number[][][]>([]);
  const [isPuzzleFilled, setIsPuzzleFilled] = useState<boolean>(false);

  // Function to generate a new puzzle
  const generateNewPuzzle = useCallback(() => {
    const newGrid = generateFullGrid();
    const newPuzzle = removeNumbers(newGrid, 40); // Adjust difficulty (e.g., 40 empty cells)
    setPuzzle(newPuzzle);
    setSolution(newGrid); // Save the complete solution
    setConflicts(Array.from({ length: 9 }, () => Array(9).fill(false))); // Reset conflicts
    setHistory([]); // Reset history
    setIsPuzzleFilled(false); // Reset filled status
  }, []);

  const handleChange = (row: number, col: number, value: string) => {
    const newPuzzle = [...puzzle];
    const newValue = parseInt(value) || 0; // Convert input to a number, or 0 if NaN
    if (newValue >= 1 && newValue <= 9) {
      setHistory([...history, puzzle.map((row) => [...row])]); // Save current state to history
      newPuzzle[row][col] = newValue;
      setPuzzle(newPuzzle);
      checkIfPuzzleFilled(newPuzzle); // Check if the puzzle is completely filled
    } else if (value === "") {
      setHistory([...history, puzzle.map((row) => [...row])]); // Save current state to history
      newPuzzle[row][col] = 0;
      setPuzzle(newPuzzle);
      checkIfPuzzleFilled(newPuzzle); // Check if the puzzle is completely filled
    }
  };

  // Function to check if the puzzle is complete
  const checkCompletion = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0 || conflicts[row][col]) {
          return false; // Incomplete or has conflicts
        }
      }
    }
    alert("Congratulations! You have completed the Sudoku puzzle!");
    return true;
  };

  // Check if the puzzle is completely filled
  const checkIfPuzzleFilled = (currentPuzzle: number[][]) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentPuzzle[row][col] === 0) {
          setIsPuzzleFilled(false);
          return;
        }
      }
    }
    setIsPuzzleFilled(true);
  };

  // Undo the last move
  const undoMove = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setHistory(history.slice(0, -1)); // Remove the last state
      setPuzzle(previousState);
      setConflicts(checkConflicts(previousState)); // Check conflicts after undoing a move
      checkIfPuzzleFilled(previousState);
    }
  };

  // Provide a hint by filling in one correct cell
  const provideHint = () => {
    const emptyCells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newPuzzle = [...puzzle];
      newPuzzle[row][col] = solution[row][col]; // Fill with the correct solution
      setPuzzle(newPuzzle);
      setConflicts(checkConflicts(newPuzzle)); // Check conflicts after providing a hint
      checkIfPuzzleFilled(newPuzzle);
    }
  };

  // Solve the entire puzzle
  const solvePuzzle = () => {
    setPuzzle(solution); // Fill in with the correct solution
    setConflicts(Array.from({ length: 9 }, () => Array(9).fill(false))); // Clear any conflicts
    setIsPuzzleFilled(true);
  };

  // Download the puzzle as a PDF
  const downloadPdf = () => {
    generatePdf(puzzle); // Use the utility function to generate and download the PDF
  };

  return {
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
  };
};

export default useSudoku;
