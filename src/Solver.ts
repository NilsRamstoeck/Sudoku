import Sudoku, { MAX_VALUE, MIN_VALUE, PUZZLE_ROOT } from "./Sudoku";


type Option = { index: number, options: number[] };

export class Solver {
    sudoku: Sudoku;

    constructor(sudoku: Sudoku) {
        this.sudoku = sudoku;
    }

    async solve(step = 200) {
        const wfc = this.wfc(this.getCellOptions());
        performance.mark('start solve');
        let state: ReturnType<typeof wfc.next>;
        const moves:{cell:number, value:number}[] = []
        do {
            state = wfc.next();
            if (state.done) break;
            moves.push(state.value);
        } while (!state.done);
        performance.mark('stop solve');
        console.log(performance.measure('solve', 'start solve', 'stop solve'))
        console.log(state);

        if(state.value){
            for(const move of moves){
                this.sudoku.set(move.cell, move.value);
                const animation = new Promise<void>(resolve => setTimeout(_ => resolve(), step));
                if (step > 0) await animation;
            }
        }
        return true;
    }

    checkSolvable(): boolean {
        if(this.sudoku.checkAll() == -1)return false;
        const wfc = this.wfc(this.getCellOptions());
        let state;
        do {
            state = wfc.next();
        } while (!state.done)
        return state.value;        
    }

    *wfc(initialOptions: Option[]) {
        let cellOptions: Option[] | undefined = initialOptions; //current set of options
        const guesses: Option[][] = []; //state of options after a guess
        //infinite loop safeguard
        let i = 0;
        while (i < 5000) {
            i++;
            
            //if there are no options left, puzzle is solved
            if(cellOptions[0] == undefined)return true;
            //sort options
            cellOptions.sort((a, b) => a.options.length - b.options.length);
            
            //if a cell doesnt have any options left, a guess must have been wrong
            if (cellOptions[0].options.length == 0) cellOptions = guesses.pop()
            if (cellOptions == undefined) return false; //if no more guesses to undo, puzzle is unsovlable

            const cellOption = cellOptions[0];
            const cellValue = cellOption.options.values().next().value;

            yield {
                cell: cellOption.index,
                value: cellValue
            };

            if (cellOption.options.length > 1) {
                cellOption.options.shift(); //remove first element from options before saving
                const cellOptionsCopy = JSON.parse(JSON.stringify(cellOptions)) as Option[];
                guesses.push(cellOptionsCopy);
            }

            const coords = Sudoku.getCellCoordinates(cellOption.index)!;
            cellOptions.forEach(contextOption => {
                const contextCoords = Sudoku.getCellCoordinates(contextOption.index)!;
                const sharesRow = contextCoords.row == coords.row;
                const sharesCol = contextCoords.col == coords.col;
                const sharesSquare = contextCoords.square == coords.square;
                if (!(sharesRow || sharesCol || sharesSquare)) return;
                contextOption.options = contextOption.options.filter(option => option != cellValue);
            });
            cellOptions.splice(0, 1);
        }
        return false; //only reached in case of an infinite loop
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

        for (let i = 0; i < this.sudoku.cells.length; i++) {
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
                options: possibleValues.filter(val => !values.includes(val))
            });
        }
        return cellOptions;
    }

}