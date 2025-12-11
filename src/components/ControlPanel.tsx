import { memo, useCallback, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "@/store/useGameStore";
import { cn } from "@/lib/utils";
import {
  RefreshCw,
  Undo,
  Lightbulb,
  CheckCircle,
  PlayCircle,
  Download,
  type LucideIcon,
} from "lucide-react";
import { generatePdf } from "@/utils/generatePdf";

interface ButtonConfig {
  label: string;
  icon: LucideIcon;
  color: string;
}

// Static button configuration (doesn't change)
const BUTTON_CONFIG: ButtonConfig[] = [
  {
    label: "New Game",
    icon: RefreshCw,
    color: "bg-blue-600 hover:bg-blue-700",
  },
  {
    label: "Undo",
    icon: Undo,
    color: "bg-amber-500 hover:bg-amber-600",
  },
  {
    label: "Hint",
    icon: Lightbulb,
    color: "bg-purple-600 hover:bg-purple-700",
  },
  {
    label: "Solve",
    icon: PlayCircle,
    color: "bg-rose-600 hover:bg-rose-700",
  },
  {
    label: "Check",
    icon: CheckCircle,
    color: "bg-emerald-600 hover:bg-emerald-700",
  },
  {
    label: "PDF",
    icon: Download,
    color: "bg-cyan-600 hover:bg-cyan-700",
  },
];

const ControlPanel = memo(() => {
  const { isComplete, isPuzzleFilled } = useGameStore(
    useShallow((state) => ({
      isComplete: state.status.isComplete,
      isPuzzleFilled: state.status.isPuzzleFilled,
    }))
  );

  const generateNewGame = useGameStore((state) => state.generateNewGame);
  const undoMove = useGameStore((state) => state.undoMove);
  const provideHint = useGameStore((state) => state.provideHint);
  const solveGame = useGameStore((state) => state.solveGame);
  const checkCompletion = useGameStore((state) => state.checkCompletion);

  // Get puzzle at click time to avoid unnecessary re-renders
  const handleDownload = useCallback(() => {
    const puzzle = useGameStore.getState().puzzle;
    generatePdf(puzzle);
  }, []);

  // Memoize handlers and disabled states
  const buttons = useMemo(
    () => [
      { ...BUTTON_CONFIG[0], onClick: generateNewGame, disabled: false },
      { ...BUTTON_CONFIG[1], onClick: undoMove, disabled: false },
      { ...BUTTON_CONFIG[2], onClick: provideHint, disabled: isComplete },
      { ...BUTTON_CONFIG[3], onClick: solveGame, disabled: isComplete },
      {
        ...BUTTON_CONFIG[4],
        onClick: checkCompletion,
        disabled: !isPuzzleFilled || isComplete,
      },
      { ...BUTTON_CONFIG[5], onClick: handleDownload, disabled: false },
    ],
    [
      generateNewGame,
      undoMove,
      provideHint,
      solveGame,
      checkCompletion,
      handleDownload,
      isComplete,
      isPuzzleFilled,
    ]
  );

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
            btn.disabled &&
              "opacity-50 cursor-not-allowed hover:bg-gray-400 bg-gray-400"
          )}
          aria-label={btn.label}
        >
          <btn.icon size={18} />
          <span className="hidden sm:inline">{btn.label}</span>
        </button>
      ))}
    </div>
  );
});

ControlPanel.displayName = "ControlPanel";

export default ControlPanel;
