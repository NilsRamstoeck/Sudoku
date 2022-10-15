import { Solver } from "./Solver";
import { MAX_VALUE, MIN_VALUE, PUZZLE_ROOT, Sudoku } from "./Sudoku";

const sudoku = new Sudoku();
const cells = [...document.querySelectorAll<HTMLElement>('.sudoku .cell')];

document.addEventListener('click', (e) => {
    cells.forEach(cell => cell.classList.toggle('selected', false));
    const targetEl = e.target as HTMLElement;
    if (targetEl.classList.contains('cell'))
        targetEl.classList.toggle('selected', true);
})

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

})

sudoku.addEventListener('cell-set', ((e: CustomEvent<{ value: number, index: number }>) => {
    const value = e.detail.value;
    cells[e.detail.index].innerHTML = (value >= MIN_VALUE && value <= MAX_VALUE ? value : '') + '';
}) as EventListener);

sudoku.addEventListener('solved', () => {
    alert('DING DING DING');
})

document.addEventListener('keypress', e => {
    const selectedCell = document.querySelector('.sudoku .cell.selected');
    if (selectedCell == null) return;
    const field = selectedCell;
    const num = Number.parseInt(e.key);
    field.classList.toggle('selected', false);
    field.innerHTML = '';
    if (Number.isNaN(num)) return;
    if (num <= 0 || num > 9) return;
    field.innerHTML = num + '';
})

function solve() {
    new Solver(sudoku).solve();
    console.log(sudoku.getCells());
}

(<any>window).solve = solve;
(<any>window).sudoku = sudoku;