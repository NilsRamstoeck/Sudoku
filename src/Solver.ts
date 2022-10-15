import Sudoku, { MAX_VALUE, MIN_VALUE, PUZZLE_ROOT } from "./Sudoku";

export class Solver {
    sudoku: Sudoku;

    constructor(sudoku: Sudoku) {
        this.sudoku = sudoku;
    }

    async solve(step = 0) {
        this.checkSolvable();
        const wfc = this.wfc();
        let state:ReturnType<typeof wfc.next>;
        do{
            state = wfc.next();
            const animation = new Promise<void>(resolve => setTimeout(_ => resolve(), step));
            if (step > 0) await animation;
        }while(!state.done);
        if(!state.value){
            alert('Unsolvable!');
        }
    }

    checkSolvable(){
        //if in one row, column or square the amount of options is smaller than the fields that share them
        //a sudoku is not solvable
        const cellOptions = this.getCellOptions();

        const rows:any = [];
        //organize options into 9 squares, columns and rows
        console.log(cellOptions.length);
        
    }

    *wfc() {
        while (true) {
            const cellOptions = this.getCellOptions();
            if (cellOptions.length == 0) return true;
            
            for (const cell of cellOptions) {
                if(cell.options.length == 0) return false;
                if (cell.options.length > 1) break;
                this.sudoku.set(cell.index, cell.options[0]);
                yield;
            }

            if (cellOptions[0].options.length > 1) {
                this.sudoku.set(cellOptions[0].index, cellOptions[0].options[0]);
                yield;
                continue;
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

        const cellOptions: {
            index: number,
            options: number[]
        }[] = [];

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
                options: possibleValues.filter(val => !values.includes(val))
            });
        }
        cellOptions.sort((a, b) => a.options.length - b.options.length);
        return cellOptions;
    }

}