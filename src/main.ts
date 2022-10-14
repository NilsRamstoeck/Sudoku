import { Sudoku } from "./Sudoku";

const sudoku = new Sudoku();
const sudokuEl = document.querySelector<HTMLElement>('.sudoku')!;
const cells = [...sudokuEl.querySelectorAll<HTMLElement>('.cell')];
let selectedCell: HTMLElement | null = null;

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        selectedCell = cell
        cells.forEach(cell => cell.classList.toggle('selected', false));
        selectedCell.classList.toggle('selected', true);
    })

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            const node = mutation.addedNodes[0];
            if (node.nodeName == '#text') {
                sudoku.set(index, Number.parseInt(node.nodeValue || ''));
                if (sudoku.checkAll()) alert('DING DING');
            }
        });
    })

    observer.observe(cell, { attributes: false, subtree: false, characterData: false, childList: true });
})

document.addEventListener('keypress', e => {
    if (selectedCell == null) return;
    const field = selectedCell;
    const num = Number.parseInt(e.key);

    selectedCell = null;
    field.classList.toggle('selected', false);

    if (Number.isNaN(num)) return;
    if (num <= 0 || num > 9) return;

    field.innerHTML = num + '';

})