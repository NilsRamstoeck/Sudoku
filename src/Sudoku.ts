const AMT_CELLS = 81;
const MIN_VALUE = 1;
const MAX_VALUE = 9;

export class Sudoku {

    cells: number[] = [];

    constructor() {
        for (let i = 0; i < AMT_CELLS; i++) {
            this.cells.push(0);
        }
    }

    static cellIsInBounds(cell: number,) {
        if (isNaN(cell)) return false;
        if (cell < 0 || cell >= AMT_CELLS) return false;
        return true;
    }

    static valueIsInBounds(value: number) {
        if (isNaN(value)) return false;
        if (value < MIN_VALUE || value > MAX_VALUE) return false;
        return true;
    }

    private static *v() {
        let dict:number[] = [];
        for(let i = 0; i < MAX_VALUE; i++){
            dict.push(i+1);
        }
        let check: number;
        while (dict.length > 0) {
            check = yield;
            if (!Sudoku.valueIsInBounds(check)) return false;
            if (dict.indexOf(check) == -1) return false;
            dict.splice(dict.indexOf(check), 1);
        }
        yield;
        return true;
    }

    static validator() {
        const validator = Sudoku.v();
        validator.next();
        return validator;
    }

    set(cell: number, value: number) {
        if (!Sudoku.cellIsInBounds(cell)) return false;
        if (!Sudoku.valueIsInBounds(value)) return false;
        this.cells[cell] = value;
        return true;
    }

    get(cell: number) {
        if (!Sudoku.cellIsInBounds(cell)) return -1;
        return this.cells[cell];
    }

    checkColumn(col: number) {
        if (!Sudoku.valueIsInBounds(col + 1)) return false;
        const validator = Sudoku.validator();
        for (let i = 0; i < MAX_VALUE; i++) {
            const index = i * MAX_VALUE + col;
            const state = validator.next(this.cells[index]);
            if (state.done) {
                return false;
            }
        }
        if (!validator.next().value == true) return false;
        return true;
    }

    checkRow(row: number) {
        if (!Sudoku.valueIsInBounds(row + 1)) return false;
        const validator = Sudoku.validator();
        for (let i = 0; i < MAX_VALUE; i++) {
            const index = row * MAX_VALUE + i;
            const state = validator.next(this.cells[index]);
            if (state.done) {
                return false;
            }
        }
        if (!validator.next().value == true) return false;
        return true;
    }

    checkSquare(square: number) {
        if (!Sudoku.valueIsInBounds(square + 1)) return false;
        const validator = Sudoku.validator();
        
        for (let i = 0; i < MAX_VALUE; i++) {
            const squareRow = Math.floor(square/3)*3;
            const squareCol = square%3 * 3;

            const colMod = i%3;
            const rowMod = Math.floor(i/3);

            const row = squareRow + rowMod;
            const col = squareCol + colMod;
            
            const index = row * MAX_VALUE + col;
            
            const state = validator.next(this.cells[index]);
            if (state.done) {
                return false;
            }
        }
        if (!validator.next().value == true) return false;
        return true;
    }
}

export default Sudoku;