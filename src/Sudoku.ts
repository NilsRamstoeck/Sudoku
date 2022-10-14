export const AMT_CELLS = 81;
export const MIN_VALUE = 1;
export const MAX_VALUE = 9; //NEEDS SQUARE ROOT TO BE INTEGER
export const PUZZLE_ROOT = Math.sqrt(MAX_VALUE);

export class Sudoku extends EventTarget {

    private cells: number[] = [];

    getCells(){
        return JSON.parse(JSON.stringify(this.cells));
    }

    constructor() {
        super();
        for (let i = 0; i < AMT_CELLS; i++) {
            this.cells.push(-1);
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

    //Checks a squence of values from MIN_VALUE to MAX_VALUE for duplicates
    private static *v() {
        let dict: number[] = [];
        for (let i = 0; i < MAX_VALUE; i++) {
            dict.push(i + 1);
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

    //Wrapper for validator generator
    static validator() {
        const validator = Sudoku.v();
        validator.next();
        return validator;
    }

    set(cell: number, value: number) {
        if (!Sudoku.cellIsInBounds(cell)) return false;
        if (!Sudoku.valueIsInBounds(value)) return false;
        if (this.cells[cell] == value) return true;

        this.cells[cell] = value;
        //TODO: Debounce
        const e = new CustomEvent('cell-set', {
            detail: {
                index: cell,
                value
            }
        });
        this.dispatchEvent(e);
        return true;
    }

    get(cell: number) {
        if (!Sudoku.cellIsInBounds(cell)) return -1;
        return this.cells[cell];
    }

    getColumn(col: number) {
        if (!Sudoku.valueIsInBounds(col + 1)) return [];
        const values: number[] = [];
        for (let i = 0; i < MAX_VALUE; i++) {
            const index = i * MAX_VALUE + col;
            values.push(this.cells[index]);
        }
        return values;
    }

    getRow(row: number) {
        if (!Sudoku.valueIsInBounds(row + 1)) return [];
        const values: number[] = [];
        for (let i = 0; i < MAX_VALUE; i++) {
            const index = row * MAX_VALUE + i;
            values.push(this.cells[index]);
        }
        return values;
    }

    getSquare(square: number) {
        if (!Sudoku.valueIsInBounds(square + 1)) return [];

        const values: number[] = [];
        for (let i = 0; i < MAX_VALUE; i++) {
            //Get column and row of first cell of the square
            const squareRow = Math.floor(square / PUZZLE_ROOT) * PUZZLE_ROOT;
            const squareCol = square % PUZZLE_ROOT * PUZZLE_ROOT;

            //get current column of row of the index within local square space (between 0 and PUZZLE_ROOT)
            const colMod = i % PUZZLE_ROOT;
            const rowMod = Math.floor(i / PUZZLE_ROOT);

            //Translate local square space to puzzle space
            const row = squareRow + rowMod;
            const col = squareCol + colMod;

            const index = row * MAX_VALUE + col;
            values.push(this.cells[index]);
        }
        return values;
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
            //Get column and row of first cell of the square
            const squareRow = Math.floor(square / PUZZLE_ROOT) * PUZZLE_ROOT;
            const squareCol = square % PUZZLE_ROOT * PUZZLE_ROOT;

            //get current column of row of the index within local square space (between 0 and PUZZLE_ROOT)
            const colMod = i % PUZZLE_ROOT;
            const rowMod = Math.floor(i / PUZZLE_ROOT);

            //Translate local square space to puzzle space
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

    checkAll() {
        let result = true;
        for (let i = 0; i < MAX_VALUE; i++) {
            result &&= this.checkColumn(i) && this.checkRow(i) && this.checkSquare(i);
            if (!result) return result;  //exit early
        }
        return result;
    }
}

export default Sudoku;