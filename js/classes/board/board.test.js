import Board from './board';
import Cell from '../cell/cell';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { jsdom } from '../../test-dom';

describe('Board', () => {
  let board;
  let boardTable;

  beforeAll(() => {
    global.window = jsdom.window;
    global.document = jsdom.window.document;
    boardTable = document.querySelector('.board');
  });

  describe('constructor', () => {
    it('should throw an error if boardSqrt is undefined', () => {
      const resultFn = () => new Board();
      expect(resultFn).toThrow('boardSqrt is required');
    });

    it('should throw an error if boardSqrt is not a number', () => {
      const resultFn = () => new Board('8');
      expect(resultFn).toThrow('boardSqrt must be a number');
    });

    it('should throw an error if boardSqrt is not a valid size', () => {
      const resultFn = () => new Board(9);
      expect(resultFn).toThrow('Invalid boardSqrt');
    });

    it('should set boardSqrt', () => {
      const board = new Board(8);
      expect(board.sqrt).toBe(8);
    });
  });

  beforeEach(() => {
    board = new Board(8);
  });

  describe('setBoard', () => {
    it('should set board', () => {
      expect(board.board).toHaveLength(8);
      expect(board.board[0]).toHaveLength(8);
      expect(board.board[0][0]).toBeInstanceOf(Cell);
    });
  });

  describe('setRandomMines', () => {
    it('should throw an error for an invalid minesCount', () => {
      const resultFn = () => board.setRandomMines(20);
      expect(resultFn).toThrow('Invalid minesCount');
    });
    it('should not throw an error for a valid minesCount', () => {
      const resultFn = () => board.setRandomMines(12);
      expect(resultFn).not.toThrow();
    });

    it('should set the correct number of mines for a valid minesCount', () => {
      const minesCount = 12;
      board.setRandomMines(minesCount);
      const actualMinesCount = board.board.flat().filter(cell => cell.isMine).length;
      expect(actualMinesCount).toEqual(minesCount);
    });

    it('should set mines in unique cells for a valid minesCount', () => {
      const minesCount = 12;
      board.setRandomMines(minesCount);
      const minesCoords = board.board
        .flat()
        .filter(cell => cell.isMine)
        .map(cell => cell.coords);
      const uniqueCoords = new Set(
        minesCoords.map(coords => `${coords.rowIdx},${coords.columnIdx}`)
      );
      expect(uniqueCoords.size).toEqual(minesCount);
    });
  });

  describe('revealSurroundingTargetCells', () => {
    const cellRender = Cell.prototype.render;

    function setupBoard(board, cellStates) {
      cellStates.forEach(([rowIdx, columnIdx, state]) => {
        board.board[rowIdx][columnIdx].setState(state);
      });
    }

    beforeAll(() => {
      Cell.prototype.render = () => vi.fn();
    });

    afterAll(() => {
      Cell.prototype.render = cellRender;
    });

    beforeEach(() => {
      board.setBoard();
    });

    it('should not reveal surrounding cells if target cell has surrounding mines', () => {
      board.board[0][0].setState({ surroundingMinesCount: 1, isShown: true });
      board.revealSurroundingTargetCells(0, 0);
      const revealedCells = board.board.flat().filter(cell => cell.isShown);
      expect(revealedCells).toHaveLength(1);
    });

    it('should not reveal surrounding cells if target cell contains mine', () => {
      board.board[0][0].setState({ isMine: true, isShown: true });
      board.revealSurroundingTargetCells(0, 0);
      const revealedCells_2 = board.board.flat().filter(cell => cell.isShown);
      expect(revealedCells_2).toHaveLength(1);
    });

    it('should reveal surrounding cells if target cell has no surrounding mines', () => {
      const cellStates = [
        [0, 0, { isShown: true }],
        [1, 0, { surroundingMinesCount: 1 }],
        [0, 1, { surroundingMinesCount: 1 }],
        [1, 1, { surroundingMinesCount: 5 }],
        [0, 2, { isMine: true }],
        [1, 2, { isMine: true }],
        [2, 0, { isMine: true }],
        [2, 1, { isMine: true }],
        [2, 2, { isMine: true }],
      ];

      setupBoard(board, cellStates);
      board.revealSurroundingTargetCells(0, 0);
      const revealedCells = board.board.flat().filter(cell => cell.isShown);
      expect(revealedCells).toHaveLength(3);
    });

    it('should exclude diagonals even if they are not mines', () => {
      const cellStates = [
        [0, 0, { isShown: true }],
        [1, 0, { surroundingMinesCount: 1 }],
        [0, 1, { surroundingMinesCount: 1 }],
        [1, 1, { surroundingMinesCount: 5 }],
        [0, 2, { isMine: true }],
        [1, 2, { isMine: true }],
        [2, 0, { isMine: true }],
        [2, 1, { isMine: true }],
        [2, 2, { isMine: true }],
      ];

      setupBoard(board, cellStates);
      board.revealSurroundingTargetCells(0, 0);
      const revealedCells = board.board.flat().filter(cell => cell.isShown);
      expect(revealedCells).toHaveLength(3);
    });

    it('should recursively reveal surrounding cells if target cell has no surrounding mines', () => {
      const cellStates = [
        [0, 0, { isShown: true }],
        [2, 0, { surroundingMinesCount: 2 }],
        [2, 1, { surroundingMinesCount: 3 }],
        [2, 2, { surroundingMinesCount: 4 }],
        [0, 2, { surroundingMinesCount: 2 }],
        [1, 2, { surroundingMinesCount: 3 }],
        [0, 3, { isMine: true }],
        [1, 3, { isMine: true }],
        [2, 3, { isMine: true }],
        [3, 1, { isMine: true }],
        [3, 2, { isMine: true }],
        [3, 3, { isMine: true }],
      ];

      setupBoard(board, cellStates);
      board.revealSurroundingTargetCells(1, 1);
      const revealedCells = board.board.flat().filter(cell => cell.isShown);
      expect(revealedCells).toHaveLength(8);
    });
  });

  describe('setSurroundingMineCount', () => {
    beforeEach(() => {
      board.setBoard();
    });

    it('should not increment the count of a surrounding cell that is a mine', () => {
      board.board[3][3].setState({ isMine: true });
      board.board[2][2].setState({ isMine: true });
      board.setSurroundingMineCount(3, 3);
      expect(board.board[2][2].surroundingMinesCount).toBe(0);
    });

    it('should increment surrounding cells mine count if a mine is present', () => {
      board.board[3][3].setState({ isMine: true });
      board.setSurroundingMineCount(3, 3);
      const surroundingCells = [
        board.board[2][2],
        board.board[2][3],
        board.board[2][4],
        board.board[3][2],
        board.board[3][4],
        board.board[4][2],
        board.board[4][3],
        board.board[4][4],
      ];

      surroundingCells.forEach(cell => {
        expect(cell.surroundingMinesCount).toBe(1);
      });
    });

    it('should keep increment surrounding cells mine count if more than one mine is present', () => {
      board.board[2][2].setState({ isMine: true });
      board.setSurroundingMineCount(2, 2);
      board.board[2][3].setState({ isMine: true });
      board.setSurroundingMineCount(2, 3);
      board.board[2][4].setState({ isMine: true });
      board.setSurroundingMineCount(2, 4);
      board.board[3][2].setState({ isMine: true });
      board.setSurroundingMineCount(3, 2);
      board.board[3][4].setState({ isMine: true });
      board.setSurroundingMineCount(3, 4);
      board.board[4][2].setState({ isMine: true });
      board.setSurroundingMineCount(4, 2);
      board.board[4][3].setState({ isMine: true });
      board.setSurroundingMineCount(4, 3);
      board.board[4][4].setState({ isMine: true });
      board.setSurroundingMineCount(4, 4);

      expect(board.board[3][3].surroundingMinesCount).toBe(8);
    });

    it('should not increment surrounding cells mine count if no mine is present', () => {
      board.board[3][3].setState({ isMine: true });
      board.setSurroundingMineCount(3, 3);

      const surroundingCells = [
        board.board[0][1],
        board.board[0][2],
        board.board[0][3],
        board.board[0][4],
        board.board[0][5],
        board.board[1][1],
        board.board[1][5],
        board.board[2][1],
        board.board[2][5],
        board.board[3][1],
        board.board[3][5],
        board.board[4][5],
        board.board[4][1],
        board.board[5][1],
        board.board[5][2],
        board.board[5][3],
        board.board[5][4],
        board.board[5][5],
      ];

      surroundingCells.forEach(cell => {
        expect(cell.surroundingMinesCount).toBe(0);
      });
    });
  });

  describe('handleHintCellClick', () => {
    const cellRender = Cell.prototype.render;

    beforeAll(() => {
      Cell.prototype.render = () => vi.fn();
    });

    afterAll(() => {
      Cell.prototype.render = cellRender;
    });

    it('should reveal all surrounding cells', () => {
      board.handleHintCellClick(1, 1);
      const revealedCells = board.board.flat().filter(cell => cell.isShown && cell.isHint);
      expect(revealedCells).toHaveLength(9);
    });

    it('should not reveal cells that are already showned', () => {
      board.board[0][0].setState({ isShown: true });
      board.handleHintCellClick(1, 1);
      const revealedCells = board.board.flat().filter(cell => cell.isShown && cell.isHint);
      expect(revealedCells).toHaveLength(8);
    });

    it('should hide all hinted cells after a delay', async () => {
      board.hintDuration = 100;
      board.handleHintCellClick(1, 1);
      const revealedCells = board.board.flat().filter(cell => cell.isShown && cell.isHint);
      expect(revealedCells).toHaveLength(9);
      await new Promise(resolve => setTimeout(resolve, 100));
      const hiddenCells = board.board.flat().filter(cell => !cell.isShown && !cell.isHint);
      const boardSize = board.sqrt * board.sqrt;
      expect(hiddenCells).toHaveLength(boardSize);
    });

    it('should not hide cells that are already showned', async () => {
      board.board[0][0].setState({ isShown: true });
      board.hintDuration = 100;
      board.handleHintCellClick(1, 1);
      const revealedCells = board.board.flat().filter(cell => cell.isShown && cell.isHint);
      expect(revealedCells).toHaveLength(8);
      await new Promise(resolve => setTimeout(resolve, 100));
      const hiddenCells = board.board.flat().filter(cell => !cell.isShown && !cell.isHint);
      const boardSize = board.sqrt * board.sqrt;
      expect(hiddenCells).toHaveLength(boardSize - 1);
    });
  });

  describe('loopThroughCells', () => {
    it('should loop through all cells', () => {
      const callback = vi.fn();
      board.loopThroughCells(callback);

      const boardSize = board.sqrt * board.sqrt;
      expect(callback).toHaveBeenCalledTimes(boardSize);
    });
  });

  describe('clone', () => {
    it('should return a new board with the same state', () => {
      board.board[0][0].setState({ isShown: true });
      board.board[0][1].setState({ isFlagged: true });
      board.board[0][2].setState({ isMine: true });
      board.board[0][3].setState({ surroundingMinesCount: 1 });
      const newBoard = board.clone();
      expect(newBoard).not.toBe(board);
      expect(newBoard).toEqual(board);
    });
  });

  describe('render', () => {
    it('render method should create a table that matches the board state', () => {
      board.board[0][0].setState({ isShown: true, isMine: false });
      board.board[3][2].setState({ isShown: false, isMine: true });
      board.board[3][4].setState({ isFlagged: true });
      board.board[4][2].setState({ isFlagged: false });
      board.board[4][3].setState({ isShown: true, isMine: true });
      board.board[4][4].setState({ surroundingMinesCount: 1, isShown: true });

      const boardStateBefore = board.board.map(row => row.map(cell => cell.getState()));

      board.render(boardTable);
      const tableBody = boardTable.querySelector('tbody');
      expect(tableBody).not.toBeNull();

      const rows = boardTable.querySelectorAll('tr');
      expect(rows.length).toBe(board.sqrt);

      rows.forEach((row, rowIdx) => {
        const cells = row.querySelectorAll('td');
        expect(cells.length).toBe(board.sqrt);
        cells.forEach((_, columnIdx) => {
          const cell = board.board[rowIdx][columnIdx];
          const renderedCell = cells[columnIdx];
          expect(renderedCell.getAttribute('data-row-idx')).toBe(String(cell.coords.rowIdx));
          expect(renderedCell.getAttribute('data-column-idx')).toBe(String(cell.coords.columnIdx));
          expect(renderedCell.getAttribute('id')).toBe(
            `cell-${cell.coords.rowIdx}-${cell.coords.columnIdx}`
          );
        });
      });

      const boardStateAfter = board.board.map(row => row.map(cell => cell.getState()));
      expect(boardStateAfter).toEqual(boardStateBefore);
    });
  });
});
