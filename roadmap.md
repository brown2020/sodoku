# Roadmap

Not implemented. Notes from the QA click-through after Check was enabled during play.

## Check feedback mid-game

When Check runs before the grid is full and every filled cell matches the solution, show a visible “no errors so far” message. Today Check only highlights wrong cells, so a correct partial board looks like the click did nothing.

## Completion message after the puzzle is solved

Show a completion message when the board is finished, including when the player uses Solve.

Check should stay disabled after Solve. Solve writes the solution and marks the game complete, so Check cannot find a mistake. Leaving it enabled would either do nothing or risk treating a revealed grid as a player win and a best time. The Solve message should say the puzzle was filled by Solve, separate from the win dialog for a puzzle the player completed.
