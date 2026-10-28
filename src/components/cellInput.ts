/** Last Sudoku digit in a string, so a filled cell can be replaced. */
export function digitFromText(text: string): number | null {
  const digits = text.match(/[1-9]/g);
  if (!digits?.length) return null;
  return Number(digits[digits.length - 1]);
}
