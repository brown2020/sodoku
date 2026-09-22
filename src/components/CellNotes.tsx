import { memo } from "react";

interface CellNotesProps {
  notesMask: number;
}

const CellNotes = memo(({ notesMask }: CellNotesProps) => {
  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-1 text-[10px] leading-none text-slate-600">
      {Array.from({ length: 9 }, (_, i) => {
        const n = i + 1;
        const bit = 1 << n;
        return (
          <div key={n} className="flex items-center justify-center">
            {notesMask & bit ? n : ""}
          </div>
        );
      })}
    </div>
  );
});
CellNotes.displayName = "CellNotes";

export default CellNotes;
