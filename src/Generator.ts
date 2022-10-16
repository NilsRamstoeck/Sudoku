import { Solver } from "./Solver";
import Sudoku from "./Sudoku";

export function generateSudoku(prefilledTiles: number) {
    const sudoku = new Sudoku();
    const solver = new Solver(sudoku);
    const cells: number[] = [];
    sudoku.cells.forEach((_, index) => cells.push(index));
    
    for (let i = 0; i < prefilledTiles; i++) {
        const randomIndex = Math.floor(Math.random() * cells.length) - 1;
        const randomCell = cells[randomIndex];

        let iterations = 0;
        const triedValues = new Set<number>();
        do {
            iterations++;
            const randomValue = Math.min(Math.floor(Math.random() * 9) + 1, 9);
            triedValues.add(randomValue);
            sudoku.set(randomCell, randomValue);
        } while (!solver.checkSolvable() && iterations < 1000);

        if (iterations == 1000) {
            console.log('ALERT');
            console.log(triedValues);
            debugger
            sudoku.unset(randomCell);
        }
    }
    return sudoku;
}