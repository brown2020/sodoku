import React from "react";
import { useGameStore } from "@/store/useGameStore";
import { cn } from "@/lib/utils";
import { 
  RefreshCw, 
  Undo, 
  Lightbulb, 
  CheckCircle, 
  PlayCircle, 
  Download
} from "lucide-react";
import { generatePdf } from "@/utils/generatePdf";

const ControlPanel = () => {
  const {
    generateNewGame,
    undoMove,
    provideHint,
    solveGame,
    checkCompletion,
    status,
    puzzle
  } = useGameStore();

  const handleDownload = () => {
    generatePdf(puzzle);
  };

  const buttons = [
    {
      label: "New Game",
      icon: RefreshCw,
      onClick: generateNewGame,
      color: "bg-blue-600 hover:bg-blue-700",
      disabled: false,
    },
    {
      label: "Undo",
      icon: Undo,
      onClick: undoMove,
      color: "bg-amber-500 hover:bg-amber-600",
      disabled: false,
    },
    {
      label: "Hint",
      icon: Lightbulb,
      onClick: provideHint,
      color: "bg-purple-600 hover:bg-purple-700",
      disabled: status.isComplete,
    },
    {
      label: "Solve",
      icon: PlayCircle,
      onClick: solveGame,
      color: "bg-rose-600 hover:bg-rose-700",
      disabled: status.isComplete,
    },
    {
      label: "Check",
      icon: CheckCircle,
      onClick: checkCompletion,
      color: "bg-emerald-600 hover:bg-emerald-700",
      disabled: !status.isPuzzleFilled || status.isComplete,
    },
    {
      label: "PDF",
      icon: Download,
      onClick: handleDownload,
      color: "bg-cyan-600 hover:bg-cyan-700",
      disabled: false,
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6 w-full max-w-3xl mx-auto px-4">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          onClick={btn.onClick}
          disabled={btn.disabled}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white shadow-sm transition-all active:scale-95",
            "focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-slate-400",
            btn.color,
            btn.disabled && "opacity-50 cursor-not-allowed hover:bg-gray-400 bg-gray-400"
          )}
          aria-label={btn.label}
        >
          <btn.icon size={18} />
          <span className="hidden sm:inline">{btn.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ControlPanel;
