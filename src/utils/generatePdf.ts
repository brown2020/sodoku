import jsPDF from "jspdf";

// Function to generate PDF
export const generatePdf = (puzzle: number[][]): void => {
  const doc = new jsPDF();

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
};
