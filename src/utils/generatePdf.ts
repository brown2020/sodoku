/**
 * Generates and downloads a PDF of the current Sudoku puzzle.
 * Uses lazy-loading for jsPDF to keep initial bundle small.
 * @returns true if successful, false if an error occurred
 */
export const generatePdf = async (puzzle: number[][]): Promise<boolean> => {
  try {
    const mod = await import("jspdf");
    const JsPdfCtor =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((mod as any).jsPDF as new () => any) ??
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((mod as any).default as new () => any);

    if (!JsPdfCtor) {
      console.error("Failed to load jsPDF library");
      return false;
    }

    const doc = new JsPdfCtor();

    // Add title to the PDF
    doc.setFontSize(16);
    doc.text("Sudoku Puzzle", 10, 10);

    // Define the starting point and spacing for the cells
    const startX = 10;
    const startY = 20;
    const cellSize = 10;

    // Draw the Sudoku grid on the PDF
    puzzle.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        // Calculate position for each cell
        const x = startX + colIndex * cellSize;
        const y = startY + rowIndex * cellSize;

        // Draw the cell border
        doc.rect(x, y, cellSize, cellSize);

        // Fill in the number if it's not zero
        if (cell !== 0) {
          doc.text(cell.toString(), x + 3, y + 7);
        }
      });
    });

    // Draw the thicker 3x3 subgrid lines
    for (let i = 0; i <= 9; i += 3) {
      const lineWidth = 0.8; // Thickness for major grid lines

      // Draw vertical lines
      const x = startX + i * cellSize;
      doc.setLineWidth(lineWidth);
      doc.line(x, startY, x, startY + 9 * cellSize);

      // Draw horizontal lines
      const y = startY + i * cellSize;
      doc.line(startX, y, startX + 9 * cellSize, y);
    }

    // Download the PDF
    doc.save("sudoku-puzzle.pdf");
    return true;
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    return false;
  }
};
