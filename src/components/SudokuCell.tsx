import {
  memo,
  useCallback,
  type ChangeEvent,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import { toIndex } from "@/utils/gameEngine";
import CellNotes from "./CellNotes";
import {
  cellBaseStyles,
  cellStateStyles,
  isPeerHighlighted,
} from "./cellStyles";

interface SudokuCellProps {
  rowIndex: number;
  colIndex: number;
}

function focusNeighbor(rowIndex: number, colIndex: number, key: string) {
  let nextRow = rowIndex;
  let nextCol = colIndex;
  if (key === "ArrowUp") nextRow -= 1;
  else if (key === "ArrowDown") nextRow += 1;
  else if (key === "ArrowLeft") nextCol -= 1;
  else if (key === "ArrowRight") nextCol += 1;
  else return false;
  const r = Math.max(0, Math.min(8, nextRow));
  const c = Math.max(0, Math.min(8, nextCol));
  const el = document.querySelector<HTMLElement>(`[data-cell="${toIndex(r, c)}"]`);
  el?.focus();
  return true;
}

const SudokuCell = memo(({ rowIndex, colIndex }: SudokuCellProps) => {
  const idx = toIndex(rowIndex, colIndex);
  const {
    value,
    notesMask,
    conflict,
    isOriginal,
    isComplete,
    isSolved,
    isNotesMode,
    selectedNumber,
    selectedCellIdx,
    setCellValue,
    selectNumber,
    setSelectedCellIdx,
    toggleNote,
  } = useGameStore(
    useShallow((state) => ({
      value: state.puzzle[idx] ?? 0,
      notesMask: state.notes[idx] ?? 0,
      conflict:
        (state.ruleConflicts[idx] ?? 0) === 1 ||
        (state.checkHighlights[idx] ?? 0) === 1 ||
        (state.incorrectHighlights[idx] ?? 0) === 1,
      isOriginal: (state.initialPuzzle[idx] ?? 0) !== 0,
      isComplete: state.status.isComplete,
      isSolved: state.status.isSolved,
      isNotesMode: state.isNotesMode,
      selectedNumber: state.selectedNumber,
      selectedCellIdx: state.selectedCellIdx,
      setCellValue: state.setCellValue,
      selectNumber: state.selectNumber,
      setSelectedCellIdx: state.setSelectedCellIdx,
      toggleNote: state.toggleNote,
    }))
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      if (inputValue === "") {
        setCellValue(rowIndex, colIndex, 0);
        return;
      }
      if (!/^[1-9]$/.test(inputValue)) return;
      const n = parseInt(inputValue, 10);
      if (isNotesMode) toggleNote(rowIndex, colIndex, n);
      else setCellValue(rowIndex, colIndex, n);
    },
    [setCellValue, toggleNote, isNotesMode, rowIndex, colIndex]
  );

  const handleClick = useCallback(() => {
    setSelectedCellIdx(idx);
    if (value === 0) {
      selectNumber(null);
      return;
    }
    selectNumber(value === selectedNumber ? null : value);
  }, [idx, setSelectedCellIdx, value, selectedNumber, selectNumber]);

  const handleFocus = useCallback(() => {
    setSelectedCellIdx(idx);
  }, [idx, setSelectedCellIdx]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (focusNeighbor(rowIndex, colIndex, e.key)) e.preventDefault();
    },
    [rowIndex, colIndex]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData("text").trim();
      const match = text.match(/[1-9]/);
      if (!match) return;
      e.preventDefault();
      setCellValue(rowIndex, colIndex, parseInt(match[0], 10));
    },
    [setCellValue, rowIndex, colIndex]
  );

  const styles = cn(
    cellBaseStyles(),
    cellStateStyles({
      conflict,
      isSelectedCell: selectedCellIdx === idx,
      isPeer: isPeerHighlighted(selectedCellIdx, rowIndex, colIndex),
      isHighlighted: value !== 0 && value === selectedNumber,
      isSolved,
      isOriginal,
    })
  );

  if (isOriginal || isComplete) {
    return (
      <button
        type="button"
        className={cn(styles, "border-0 p-0")}
        onClick={handleClick}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        data-cell={idx}
        aria-invalid={conflict || undefined}
        aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}, value ${value}`}
      >
        {value !== 0 ? value : ""}
      </button>
    );
  }

  const showNotes = value === 0 && notesMask !== 0;

  return (
    <div className={cn(styles, "relative")}>
      {showNotes ? <CellNotes notesMask={notesMask} /> : null}
      <input
        type="tel"
        inputMode="numeric"
        pattern="[1-9]*"
        value={value !== 0 ? value : ""}
        onChange={handleChange}
        onClick={handleClick}
        onFocus={handleFocus}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className={cn(
          "absolute inset-0 w-full h-full bg-transparent text-inherit text-center",
          "caret-transparent"
        )}
        maxLength={1}
        autoComplete="off"
        data-cell={idx}
        aria-invalid={conflict || undefined}
        aria-label={`Editable cell ${rowIndex + 1}, ${colIndex + 1}`}
      />
    </div>
  );
});

SudokuCell.displayName = "SudokuCell";

export default SudokuCell;
