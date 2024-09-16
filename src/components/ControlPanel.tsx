interface ControlPanelProps {
  generateNewPuzzle: () => void;
  checkCompletion: () => boolean; // Corrected return type to boolean
  undoMove: () => void;
  provideHint: () => void;
  solvePuzzle: () => void;
  downloadPdf: () => void;
  isPuzzleFilled: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  generateNewPuzzle,
  checkCompletion,
  undoMove,
  provideHint,
  solvePuzzle,
  downloadPdf,
  isPuzzleFilled,
}) => {
  return (
    <div className="mb-4 flex justify-center space-x-4">
      <button
        onClick={generateNewPuzzle}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        New Game
      </button>
      <button
        onClick={undoMove}
        className="px-4 py-2 bg-yellow-500 text-white rounded"
      >
        Undo
      </button>
      <button
        onClick={provideHint}
        className="px-4 py-2 bg-purple-500 text-white rounded"
      >
        Hint
      </button>
      <button
        onClick={solvePuzzle}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Solve
      </button>
      <button
        onClick={downloadPdf}
        className="px-4 py-2 bg-teal-500 text-white rounded"
      >
        Download PDF
      </button>
      <button
        onClick={checkCompletion}
        disabled={!isPuzzleFilled}
        className={`px-4 py-2 ${
          isPuzzleFilled ? "bg-green-500" : "bg-gray-400 cursor-not-allowed"
        } text-white rounded`}
      >
        Check Solution
      </button>
    </div>
  );
};

export default ControlPanel;
