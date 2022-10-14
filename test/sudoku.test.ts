import { expect } from 'chai';
import Sudoku from '../src/Sudoku';

describe('Sudoku', () => {



    describe('Access to cells', () => {
        let sudoku: Sudoku;

        before(() => {
            sudoku = new Sudoku();
        });

        it('Can set a cell', () => {
            let result = sudoku.set(45, 9);
            expect(result).to.be.true;

            result = sudoku.set(100, 5);
            expect(result).to.be.false;

            result = sudoku.set(20, -5);
            expect(result).to.be.false;
        });

        it('Can get a cell', () => {
            let result = sudoku.get(45);
            expect(result).to.equal(9);

            result = sudoku.get(100);
            expect(result).to.equal(-1);

            result = sudoku.get(20);
            expect(result).to.equal(0);
        });
    });

    describe('Helpers', () => {
        let sudoku: Sudoku;

        before(() => {
            sudoku = new Sudoku();
        })

        it('Can test cell bounds', () => {
            expect(Sudoku.cellIsInBounds(NaN)).to.be.false
            expect(Sudoku.cellIsInBounds(-5)).to.be.false
            expect(Sudoku.cellIsInBounds(0)).to.be.true
            expect(Sudoku.cellIsInBounds(81)).to.be.false
        })


        it('Can test value bounds', () => {
            expect(Sudoku.valueIsInBounds(NaN)).to.be.false
            expect(Sudoku.valueIsInBounds(-5)).to.be.false
            expect(Sudoku.valueIsInBounds(1)).to.be.true
            expect(Sudoku.valueIsInBounds(9)).to.be.true
            expect(Sudoku.valueIsInBounds(10)).to.be.false
        })

        it('Can validate section', () => {
            let valid = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            let invalid = [1, 2, 3, 4, 5, 6, 7, 8, 8];

            let validator = Sudoku.validator();
            for (let value of valid) {
                validator.next(value);
            }

            let result = validator.next();

            expect(result.done).to.be.true;
            expect(result.value).to.be.true;

            validator = Sudoku.validator();
            for (let value of invalid) {
                const state = validator.next(value);
                if (state.done) {
                    expect(state.value).to.be.false;
                    break;
                }
            }

        })

    })

    describe('Check if solved', () => {
        let validSudoku: Sudoku;
        let invalidSudoku: Sudoku;

        before(() => {
            validSudoku = new Sudoku();
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    let index = i * 9 + j;
                    validSudoku.set(index, ((j + i) % 9) + 1);
                }
            }

            invalidSudoku = new Sudoku();
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    let index = i * 9 + j;
                    invalidSudoku.set(index, ((j + i) % 9) + 1);
                }
                invalidSudoku.set(i, 1);
            }
        });

        it('Can check a column', () => {
            let result = validSudoku.checkColumn(0);
            expect(result).to.be.true;

            result = invalidSudoku.checkColumn(1);
            expect(result).to.be.false;
        });

        it('Can check a row', () => {
            let result = validSudoku.checkRow(0);
            expect(result).to.be.true;

            result = invalidSudoku.checkRow(0);
            expect(result).to.be.false;
        });

        it('Can check a square', () => {
            let result = validSudoku.checkRow(8);
            expect(result).to.be.true;

            result = invalidSudoku.checkRow(0);
            expect(result).to.be.false;
        });

    });

});