import { cn } from "@/lib/utils";

export function isPeerHighlighted(
  selectedCellIdx: number | null,
  rowIndex: number,
  colIndex: number
): boolean {
  if (selectedCellIdx == null) return false;
  const selectedRow = Math.floor(selectedCellIdx / 9);
  const selectedCol = selectedCellIdx % 9;
  if (selectedRow === rowIndex || selectedCol === colIndex) return true;
  return (
    Math.floor(selectedCellIdx / 27) === Math.floor(rowIndex / 3) &&
    Math.floor((selectedCellIdx % 9) / 3) === Math.floor(colIndex / 3)
  );
}

export function cellBaseStyles(): string {
  return cn(
    "aspect-square w-full h-full flex items-center justify-center text-center transition-colors duration-200 cursor-pointer select-none",
    "text-lg sm:text-xl md:text-2xl font-medium",
    "focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-inset z-10"
  );
}

export function cellStateStyles(args: {
  conflict: boolean;
  isSelectedCell: boolean;
  isPeer: boolean;
  isHighlighted: boolean;
  isSolved: boolean;
  isOriginal: boolean;
}): string {
  const {
    conflict,
    isSelectedCell,
    isPeer,
    isHighlighted,
    isSolved,
    isOriginal,
  } = args;
  return cn(
    conflict && "bg-red-100 text-red-600",
    !conflict && isSelectedCell && "bg-slate-200",
    !conflict && !isSelectedCell && isPeer && "bg-slate-50",
    !conflict && isHighlighted && "bg-blue-500 text-white",
    !conflict && !isHighlighted && isSolved && "text-blue-600 bg-blue-50",
    !conflict &&
      !isHighlighted &&
      isOriginal &&
      "bg-slate-100 font-bold text-slate-900",
    !conflict &&
      !isHighlighted &&
      !isOriginal &&
      !isSolved &&
      "bg-white hover:bg-slate-50 text-slate-700"
  );
}
