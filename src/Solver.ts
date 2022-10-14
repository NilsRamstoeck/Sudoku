import Sudoku, { MAX_VALUE, MIN_VALUE, PUZZLE_ROOT } from "./Sudoku";

export class Solver {
    sudoku: Sudoku;

    constructor(sudoku: Sudoku) {
        this.sudoku = sudoku;
    }

    solve() {
        //generate possibilities for every cell
        const possibleValues = [];
        for (let i = 0; i < MAX_VALUE; i++) {
            possibleValues.push(i + 1);
        }

        const cellOptions:{
            index:number,
            options:number[]
        }[] = [];

        for (let i = 0; i < this.sudoku.getCells().length; i++) {
            const cellValue = this.sudoku.get(i);
            if (cellValue >= MIN_VALUE) continue;

            const rowIndex = Math.floor(i / MAX_VALUE);
            const colIndex = i % MAX_VALUE;
            const squareIndex = Math.floor(rowIndex / PUZZLE_ROOT) % PUZZLE_ROOT * PUZZLE_ROOT + Math.floor(colIndex / PUZZLE_ROOT);

            const rowValues = this.sudoku.getRow(rowIndex);
            const colValues = this.sudoku.getColumn(colIndex);
            const squareValues = this.sudoku.getSquare(squareIndex);

            const values = [ //get all existing values
                ...rowValues,
                ...colValues,
                ...squareValues]
                .filter(val => val >= MIN_VALUE)
                .filter((val, index, self) => self.indexOf(val) == index);

            cellOptions.push({
                index: i,
                options: possibleValues.filter(val => !values.includes(val))
            });
        }

        cellOptions.sort((a, b) => a.options.length - b.options.length);

        for (const cell of cellOptions) {
            if (cell.options.length > 1) break;
            this.sudoku.set(cell.index, cell.options[0]);
        }
        
        if(cellOptions.length == 0)return;
        if(cellOptions[0].options.length > 1){
            this.sudoku.set(cellOptions[0].index, cellOptions[0].options[0])
        }

        this.solve();
    }

}