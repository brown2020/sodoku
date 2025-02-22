// ControlPanel.tsx
interface ControlPanelProps {
  generateNewPuzzle: () => void;
  checkCompletion: () => void; // Changed from boolean to void
  undoMove: () => void;
  provideHint: () => void;
  solvePuzzle: () => void;
  downloadPdf: () => void;
  isPuzzleFilled: boolean;
  isComplete: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  generateNewPuzzle,
  checkCompletion,
  undoMove,
  provideHint,
  solvePuzzle,
  downloadPdf,
  isPuzzleFilled,
  isComplete,
}) => {
  const buttonClass =
    "px-4 py-2 rounded-sm transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2";

  return (
    <div className="mb-6 flex flex-wrap justify-center gap-4">
      <button
        onClick={generateNewPuzzle}
        className={`${buttonClass} bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500`}
      >
        New Game
      </button>

      <button
        onClick={undoMove}
        className={`${buttonClass} bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500`}
      >
        Undo
      </button>

      <button
        onClick={provideHint}
        className={`${buttonClass} bg-purple-500 hover:bg-purple-600 text-white focus:ring-purple-500`}
        disabled={isComplete}
      >
        Hint
      </button>

      <button
        onClick={solvePuzzle}
        className={`${buttonClass} bg-red-500 hover:bg-red-600 text-white focus:ring-red-500`}
        disabled={isComplete}
      >
        Solve
      </button>

      <button
        onClick={downloadPdf}
        className={`${buttonClass} bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-500`}
      >
        Download PDF
      </button>

      <button
        onClick={checkCompletion}
        disabled={!isPuzzleFilled || isComplete}
        className={`${buttonClass} ${
          !isPuzzleFilled || isComplete
            ? "bg-gray-400 cursor-not-allowed text-gray-200"
            : "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500"
        }`}
      >
        Check Solution
      </button>
    </div>
  );
};

export default ControlPanel;
