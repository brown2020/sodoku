# Sudoku

A web-based Sudoku game built with Next.js, TypeScript, and Tailwind CSS. This app allows users to play Sudoku, check solutions, provide hints, and download the current puzzle as a PDF.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Generate New Puzzle**: Creates a new Sudoku puzzle of varying difficulty.
- **Check Solution**: Validates the user's solution and provides feedback.
- **Undo Moves**: Allows the user to undo the last move.
- **Provide Hints**: Fills in one correct cell as a hint.
- **Solve Puzzle**: Solves the puzzle for the user.
- **Download PDF**: Exports the current puzzle to a PDF with proper grid lines.
- **Responsive Design**: Fully responsive design using Tailwind CSS.

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/brown2020/sudoku.git
   cd sudoku
   ```

2. **Install the dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Usage

- Click on **New Game** to generate a fresh Sudoku puzzle.
- Fill in the numbers using the keyboard input.
- Use **Check Solution** to verify your answers.
- **Undo** to revert the last move.
- **Hint** provides a correct number for one empty cell.
- **Solve** completes the puzzle.
- **Download PDF** to export the current state of the puzzle.

## Technologies Used

- **Next.js**: A React framework for building fast and user-friendly web applications.
- **TypeScript**: A typed superset of JavaScript that enhances code quality and maintainability.
- **Tailwind CSS**: A utility-first CSS framework for styling the app.
- **jsPDF**: A library for generating PDFs in JavaScript.

## Project Structure

```
sudoku/
├── public/                   # Static assets
├── src/
│   ├── components/           # React components (ControlPanel, SudokuGrid, SudokuCell, etc.)
│   ├── hooks/                # Custom React hooks (useSudoku.ts)
│   ├── utils/                # Utility functions (generatePdf.ts, sudokuUtils.ts)
│   └── pages/                # Next.js pages (index.tsx)
├── styles/                   # Global styles
├── README.md                 # Project README file
├── package.json              # NPM package file
└── tsconfig.json             # TypeScript configuration
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For more information, please contact:

- **GitHub**: [brown2020](https://github.com/brown2020)
- **Email**: [info@ignitechannel.com](mailto:info@ignitechannel.com)
