import Sudoku, { MAX_VALUE, MIN_VALUE, PUZZLE_ROOT } from "./Sudoku";


type Option = { index: number, options: Set<Number> };

export class Solver {
    sudoku: Sudoku;

    constructor(sudoku: Sudoku) {
        this.sudoku = sudoku;
    }

    async solve(step = 500) {
        if(!this.checkSolvable())return;
        const wfc = this.wfc(this.getCellOptions());
        performance.mark('start solve');
        let state: ReturnType<typeof wfc.next>;
        do {
            state = wfc.next();
            if (state.done) break;
            this.sudoku.set(state.value.cell, state.value.value);
            const animation = new Promise<void>(resolve => setTimeout(_ => resolve(), step));
            if (step > 0) await animation;
        } while (!state.done);
        performance.mark('stop solve');
        console.log(performance.measure('solve', 'start solve', 'stop solve'))
        return true;
    }

    checkSolvable(): boolean {
        performance.mark('start checkSolvable');
        const wfc = this.wfc(this.getCellOptions());
        let state;
        do {
            state = wfc.next();
        } while (!state.done)
        performance.mark('stop checkSolvable');
        console.log(performance.measure('checkSolvable', 'start checkSolvable', 'stop checkSolvable'))
        return state.value;        
    }

    *wfc(cellOptions: Option[]) {
        const updateCellOptions = (index: number, value: number) => {
            cellOptions.splice(0, 1);
            const coords = Sudoku.getCellCoordinates(index)!;
            cellOptions.forEach(contextOption => {
                const contextCoords = Sudoku.getCellCoordinates(contextOption.index)!;
                const sharesRow = contextCoords.row == coords.row;
                const sharesCol = contextCoords.col == coords.col;
                const sharesSquare = contextCoords.square == coords.square;
                if (!(sharesRow || sharesCol || sharesSquare)) return;
                contextOption.options.delete(value);
            });
        }

        while (true) {
            if (cellOptions.length == 0) return true;
            cellOptions.sort((a, b) => {
                if (a.options.size < b.options.size) return -1;
                if (a.options.size > b.options.size) return 1;
                if (a.index < b.index) return -1;
                if (a.index > b.index) return 1;
                return 0;
            });
            const cellOption = cellOptions[0];
            if (cellOption.options.size == 0) return false;
            const cellValue = cellOption.options.values().next().value;

            if (cellOption.options.size >= 1) {
                yield {
                    cell: cellOption.index,
                    value: cellValue
                };
                updateCellOptions(cellOption.index, cellValue);
            }

        }
    }

    getCellOption(cell: number) {
        if (!Sudoku.cellIsInBounds(cell)) return null;
        return this.getCellOptions().find((el) => el.index == cell);
    }

    getCellOptions() {
        //generate possibilities for every cell
        const possibleValues = [];
        for (let i = 0; i < MAX_VALUE; i++) {
            possibleValues.push(i + 1);
        }

        const cellOptions: Option[] = [];

        for (let i = 0; i < this.sudoku.getCells().length; i++) {
            const cellValue = this.sudoku.get(i);
            if (cellValue >= MIN_VALUE) continue;

            const cellCoords = Sudoku.getCellCoordinates(i);
            if (cellCoords == null) throw new Error('Can not get coordinates of cell: ' + i);

            const rowValues = this.sudoku.getRow(cellCoords.row);
            const colValues = this.sudoku.getColumn(cellCoords.col);
            const squareValues = this.sudoku.getSquare(cellCoords.square);

            const values = [ //get all existing values
                ...rowValues,
                ...colValues,
                ...squareValues]
                .filter(val => val >= MIN_VALUE)
                .filter((val, index, self) => self.indexOf(val) == index);

            cellOptions.push({
                index: i,
                options: new Set(possibleValues.filter(val => !values.includes(val)))
            });
        }
        return cellOptions;
    }

}