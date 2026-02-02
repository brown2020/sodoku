import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Sudoku",
  description: "Learn about our modern Sudoku game and its features",
};

export default function AboutPage() {
  return (
    <main className="bg-slate-50 py-8 sm:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
          About Sudoku
        </h1>

        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              What is Sudoku?
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Sudoku is a logic-based number placement puzzle. The objective is
              to fill a 9x9 grid with digits so that each column, each row, and
              each of the nine 3x3 subgrids contains all of the digits from 1 to
              9.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Features
            </h2>
            <ul className="list-disc list-inside text-slate-600 space-y-2">
              <li>Three difficulty levels: Easy, Medium, and Hard</li>
              <li>Intelligent puzzle generation with unique solutions</li>
              <li>Real-time conflict detection</li>
              <li>Pencil marks (notes) for candidate tracking</li>
              <li>Auto-notes feature to fill in all candidates</li>
              <li>Undo functionality with full move history</li>
              <li>Hint system for when you get stuck</li>
              <li>PDF export for offline play</li>
              <li>Move counter and timer</li>
              <li>Mobile-friendly responsive design</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              How to Play
            </h2>
            <ol className="list-decimal list-inside text-slate-600 space-y-2">
              <li>Select a cell by clicking or tapping on it</li>
              <li>Enter a number using the number pad or keyboard (1-9)</li>
              <li>Use arrow keys to navigate between cells</li>
              <li>Toggle Notes mode to add pencil marks</li>
              <li>Use the Undo button to reverse mistakes</li>
              <li>Click Check to verify your solution</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-3">
              Technology
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Built with Next.js, React, TypeScript, and Tailwind CSS. The
              puzzle generation uses a backtracking algorithm to create valid
              Sudoku grids with unique solutions.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
