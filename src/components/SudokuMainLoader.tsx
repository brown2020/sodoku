"use client";

import dynamic from "next/dynamic";

const SudokuMain = dynamic(() => import("./SudokuMain"), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="w-full max-w-md aspect-square bg-slate-100 rounded-lg animate-pulse" />
      </div>
    </main>
  ),
});

export default function SudokuMainLoader() {
  return <SudokuMain />;
}


