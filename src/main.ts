import { generateSudoku } from "./Generator";
import { Solver } from "./Solver";
import { MAX_VALUE, MIN_VALUE, PUZZLE_ROOT, Sudoku } from "./Sudoku";

const sudoku = new Sudoku();
const solver = new Solver(sudoku);
const cells = [...document.querySelectorAll<HTMLElement>('.sudoku .cell')];

// const puzzle = [1, 2, 3, -1, -1, -1, -1, -1, -1, 4, 5, 6, 2, 1, 3, 7, 9, 8, 7, 8, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
// const puzzle = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
// const puzzle = [-1, -1, -1, 8, -1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, -1, -1, 4, -1, -1, -1, -1, 3, -1, -1, -1, -1, 9, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8, -1, -1, -1, 3, 7, -1, -1, -1, -1, -1, -1, 5, -1, -1, -1, 2, -1, 7, -1, -1, -1, 2, -1, 5, 1, -1, -1, 3, -1, -1];

// puzzle[24] = 4;

//Selection of cells
document.addEventListener('click', (e) => {
    cells.forEach(cell => cell.classList.toggle('selected', false));
    const targetEl = e.target as HTMLElement;
    if (!cells.includes(targetEl)) return;
    targetEl.classList.toggle('selected', true);
})

//Number input
document.addEventListener('keypress', e => {
    const selectedCell = document.querySelector('.sudoku .cell.selected');
    if (selectedCell == null) return;
    const field = selectedCell;
    const num = Number.parseInt(e.key);
    field.classList.toggle('selected', false);
    if (isNaN(num) || num <= 0 || num > 9) {
        field.innerHTML = '';
    } else {
        field.innerHTML = num + '';
    }
})


//setup cells to reflect sudoku and vice versa//
cells.forEach((cell, index) => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            const node = mutation.addedNodes[0];
            if (node && node.nodeName == '#text') {
                const value = Number.parseInt(node.nodeValue || '');
                sudoku.set(index, value);
            } else {
                sudoku.unset(index);
            }
        });
    })
    observer.observe(cell, { attributes: false, subtree: false, characterData: false, childList: true });
    // cell.innerHTML = (puzzle[index] > 0 ? puzzle[index] : '') + '';
    // cell.setAttribute('index', index + '');
})

sudoku.addEventListener('cell-set', ((e: CustomEvent<{ value: number, index: number }>) => {
    const { index, value } = e.detail;

    if (value + '' != cells[index].innerHTML)
        cells[index].innerHTML = (Sudoku.valueIsInBounds(value) ? value : '') + '';


    cells.forEach(el => {
        el.classList.toggle('invalid', false);
        el.classList.toggle('valid', false);
    })

    if (!solver.checkSolvable()) {
        console.log(solver.checkSolvable());

        cells[index].classList.toggle('invalid', true);
    }

    const methods = [
        {
            check: (i: number) => sudoku.checkRow(i),
            elements: (i: number) => getHTMLRow(i)
        },
        {
            check: (i: number) => sudoku.checkColumn(i),
            elements: (i: number) => getHTMLColumn(i)
        },
        {
            check: (i: number) => sudoku.checkSquare(i),
            elements: (i: number) => getHTMLSquare(i)
        }
    ]

    for (const method of methods) {
        for (let i = 0; i < MAX_VALUE; i++) {
            const validity = method.check(i);
            const elements = method.elements(i);

            elements.forEach(el => {
                if (el.innerHTML == '') return;
                if (validity == -1)
                    el.classList.toggle('invalid', true);
                if (validity == 1)
                    el.classList.toggle('valid', true);
            });
        }
    }
}) as EventListener);

//Handle sudoku solved
sudoku.addEventListener('solved', () => {
    // alert('DING DING DING');
})

async function solve(step: number | undefined) {
    return await solver.solve(step);
}

function getHTMLColumn(col: number) {
    if (!Sudoku.valueIsInBounds(col + 1)) return [];
    const values: HTMLElement[] = [];
    for (let i = 0; i < MAX_VALUE; i++) {
        const index = i * MAX_VALUE + col;
        values.push(cells[index]);
    }
    return values;
}

function getHTMLRow(row: number) {
    if (!Sudoku.valueIsInBounds(row + 1)) return [];
    const values: HTMLElement[] = [];
    for (let i = 0; i < MAX_VALUE; i++) {
        const index = row * MAX_VALUE + i;
        values.push(cells[index]);
    }
    return values;
}

function getHTMLSquare(square: number) {
    if (!Sudoku.valueIsInBounds(square + 1)) return [];

    const values: HTMLElement[] = [];
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
        values.push(cells[index]);
    }
    return values;
}

//expose solve and sudoku
(<any>window).solve = solve;
(<any>window).solver = solver;
(<any>window).sudoku = sudoku;
(<any>window).getHTMLColumn = getHTMLColumn;
(<any>window).getHTMLRow = getHTMLRow;
(<any>window).getHTMLSquare = getHTMLSquare

generateSudoku(70).cells.forEach((value, cell) => {
    sudoku.set(cell, value);
})

//
// setTimeout(() => { solve(300) }, 500);
// setTimeout(() => { solve() }, 500);