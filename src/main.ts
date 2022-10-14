import { Solver } from "./Solver";
import { MAX_VALUE, PUZZLE_ROOT, Sudoku } from "./Sudoku";

const sudoku = new Sudoku();
const sudokuEl = document.querySelector<HTMLElement>('.sudoku')!;
const cells = [...sudokuEl.querySelectorAll<HTMLElement>('.cell')];
let selectedCell: HTMLElement | null = null;

const solved = [
    3, 1, 6, 5, 7, 8, 4, 9, 2,
    5, 2, 9, 1, 3, 4, 7, 6, 8,
    4, 8, 7, 6, 2, 9, 5, 3, 1,
    2, 6, 3, 4, 1, 5, 9, 8, 7,
    9, 7, 4, 8, 6, 3, 1, 2, 5,
    8, 5, 1, 7, 9, 2, 6, 4, 3,
    1, 3, 8, 9, 4, 7, 2, 5, 6,
    6, 9, 2, 3, 5, 1, 8, 7, 4,
    7, 4, 5, 2, 8, 6, 3, 1, 9,
]

//random numbers
const rands = [0.40800894217393935, 0.9305523786834988, 0.4640801111366428, 0.4123480920601803, 0.8388630720090667, 0.9020697645075132, 0.5218911071493764, 0.009517118602357377, 0.5842025315303515, 0.9513018692543033, 0.21790084142890342, 0.7328833437115134, 0.3023776367538974, 0.36692312661094884, 0.5859993067022814, 0.4975467195194252, 0.4217589637287752, 0.5618910459930104, 0.776586596832637, 0.9369671172626676, 0.7535449162605168, 0.9540111065452012, 0.38214122925463423, 0.473372473462113, 0.19397927007288374, 0.11629750728660693, 0.46732792463253736, 0.048112902396652, 0.33988160906436393, 0.07047233151392729, 0.0034906325494387103, 0.16534523574724114, 0.7173394314734912, 0.6752374636757777, 0.28341941693850514, 0.11197373346341433, 0.43021071250734677, 0.1775333348906859, 0.903721604462046, 0.4162489423471465, 0.8005465579131731, 0.8376358950961892, 0.2739967364461572, 0.32896871699329666, 0.260310720432244, 0.29089685327620496, 0.4301644817523387, 0.8037534891555355, 0.2808480172361807, 0.16033366824092232, 0.8178496656653191, 0.9808982880176075, 0.4187844307729295, 0.8013458460179318, 0.938889951975039, 0.8317925469194497, 0.16895821164258973, 0.6658122296235219, 0.6803742728046412, 0.7512573082328806, 0.014460501184220709, 0.21477393168202974, 0.36033492602735884, 0.8568953906975482, 0.8195658615654434, 0.4422870678830849, 0.899945963538934, 0.3522581301969978, 0.36320536136095904, 0.8923640859352979, 0.18719629991220244, 0.7858591619660864, 0.2210745822931649, 0.9270586333952926, 0.7320038636248881, 0.51444421258816, 0.38400524037433426, 0.5942136795401043, 0.1399643730802843, 0.1688598455147592, 0.7763831404515426];


cells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
        selectedCell = cell;
        cells.forEach(cell => cell.classList.toggle('selected', false));
        selectedCell.classList.toggle('selected', true);
    })

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            const node = mutation.addedNodes[0];
            if (node.nodeName == '#text') {
                sudoku.set(index, Number.parseInt(node.nodeValue || ''));
                //TODO:Debounce
                if (sudoku.checkAll()) alert('DING DING');
            }
        });
    })

    observer.observe(cell, { attributes: false, subtree: false, characterData: false, childList: true });

    // if(rands[index] > 0.05){
    //     cell.innerHTML = solved[index]+'';
    // }
})

sudoku.addEventListener('cell-set', ((e:CustomEvent<{value:number,index:number}>) => {
    cells[e.detail.index].innerHTML = e.detail.value+'';
}) as EventListener);

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