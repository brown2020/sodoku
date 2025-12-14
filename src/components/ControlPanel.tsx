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
  Pencil,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { generatePdf } from "@/utils/generatePdf";
import { computeIsFilled, flatToGrid } from "@/utils/gameEngine";
import NumberPad from "./NumberPad";

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
  const { isComplete, isPuzzleFilled, isNotesMode, isAutoCheckEnabled } =
    useGameStore(
      useShallow((state) => ({
        isComplete: state.status.isComplete,
        isPuzzleFilled: computeIsFilled(state.puzzle),
        isNotesMode: state.isNotesMode,
        isAutoCheckEnabled: state.isAutoCheckEnabled,
      }))
    );

  const generateNewGame = useGameStore((state) => state.generateNewGame);
  const undoMove = useGameStore((state) => state.undoMove);
  const provideHint = useGameStore((state) => state.provideHint);
  const solveGame = useGameStore((state) => state.solveGame);
  const checkCompletion = useGameStore((state) => state.checkCompletion);
  const toggleNotesMode = useGameStore((state) => state.toggleNotesMode);
  const toggleAutoCheck = useGameStore((state) => state.toggleAutoCheck);
  const autoFillNotes = useGameStore((state) => state.autoFillNotes);

  // Get puzzle at click time to avoid unnecessary re-renders
  const handleDownload = useCallback(async () => {
    const puzzle = useGameStore.getState().puzzle;
    await generatePdf(flatToGrid(puzzle));
  }, []);

  // Memoize handlers and disabled states
  const buttons = useMemo(
    () => [
      { ...BUTTON_CONFIG[0], onClick: generateNewGame, disabled: false },
      { ...BUTTON_CONFIG[1], onClick: undoMove, disabled: isComplete },
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
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-wrap justify-center gap-3 mb-4 px-4">
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

      <div className="flex flex-wrap justify-center gap-3 mb-4 px-4">
        <button
          type="button"
          onClick={toggleNotesMode}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm transition-all active:scale-95",
            "focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-slate-400",
            isNotesMode
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-800 border border-slate-200"
          )}
          aria-pressed={isNotesMode}
        >
          <Pencil size={18} />
          <span className="hidden sm:inline">Notes</span>
        </button>

        <button
          type="button"
          onClick={autoFillNotes}
          disabled={isComplete || isPuzzleFilled}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm transition-all active:scale-95",
            "focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-slate-400",
            "bg-white text-slate-800 border border-slate-200",
            (isComplete || isPuzzleFilled) &&
              "opacity-50 cursor-not-allowed hover:bg-white"
          )}
          aria-label="Auto-fill notes"
        >
          <Sparkles size={18} />
          <span className="hidden sm:inline">Auto notes</span>
        </button>

        <button
          type="button"
          onClick={toggleAutoCheck}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm transition-all active:scale-95",
            "focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-slate-400",
            isAutoCheckEnabled
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-800 border border-slate-200"
          )}
          aria-pressed={isAutoCheckEnabled}
        >
          <ShieldCheck size={18} />
          <span className="hidden sm:inline">Auto-check</span>
        </button>
      </div>

      <div className="mb-6">
        <NumberPad />
      </div>
    </div>
  );
});

ControlPanel.displayName = "ControlPanel";

export default ControlPanel;
