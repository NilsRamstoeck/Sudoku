import { Solver } from "./Solver";
import Sudoku from "./Sudoku";

const cellsHTML = [...document.querySelectorAll<HTMLElement>('.sudoku .cell')];


export function generateSudoku(prefilledTiles: number) {
    const sudoku = new Sudoku();
    const solver = new Solver(sudoku);
    const cells: number[] = [];
    sudoku.getCells().forEach((_, index) => cells.push(index));
    console.log(solver);

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
            cellsHTML[randomCell].innerHTML = randomValue+'';
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