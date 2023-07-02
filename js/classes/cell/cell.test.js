import Cell from './cell.js';
import { fireEvent, getByTestId, render } from '@testing-library/dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { MINE_IMG } from '../../image-assets';

describe('Cell', () => {
  let cell;
  let dom;

  beforeEach(() => {
    const [rowIdx, columnIdx] = [1, 1];
    cell = new Cell({ rowIdx, columnIdx });

    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <table>
            <tbody>
              <tr>
                <td class="cell inset-border" data-row-idx="${rowIdx}" data-column-idx="${columnIdx}" id="cell-${rowIdx}-${columnIdx}"></td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `);

    const { document } = dom.window;
    global.document = document;
    global.window = dom.window;
  });

  describe('constructor', () => {
    it('should correctly initialize a new cell', () => {
      const coords = { rowIdx: 0, columnIdx: 0 };
      const cell = new Cell(coords);

      const expectedCell = {
        isShown: false,
        isMine: false,
        isFlagged: false,
        surroundingMinesCount: 0,
        coords,
      };
      expect(cell).toEqual(expectedCell);
    });

    it('should throw an error if no coordinates are provided', () => {
      const resultFn = () => new Cell();
      expect(resultFn).toThrow('No coordinates provided');
    });

    it('should throw an error if only rowIdx is provided', () => {
      const resultFn = () => new Cell({ rowIdx: 0 });
      expect(resultFn).toThrow('Invalid coordinates provided');
    });

    it('should throw an error if only columnIdx is provided', () => {
      const resultFn = () => new Cell({ columnIdx: 0 });
      expect(resultFn).toThrow('Invalid coordinates provided');
    });

    it('should throw an error if columnIdx is not a number', () => {
      const resultFn = () => new Cell({ rowIdx: 0, columnIdx: '0' });
      expect(resultFn).toThrow('Invalid coordinates provided');
    });

    it('should throw an error if provided coordinates keys are not rowIdx and columnIdx', () => {
      const resultFn = () => new Cell({ x: 0, y: 0 });
      expect(resultFn).toThrow('Invalid coordinates provided');
    });

    it('should throw an error if provided coordinates are in array format', () => {
      const resultFn = () => new Cell([0, 0]);
      expect(resultFn).toThrow('Invalid coordinates provided');
    });

    it('should throw an error if provided coordinates are in separate arguments format', () => {
      const resultFn = () => new Cell(0, 0);
      expect(resultFn).toThrow('Invalid coordinates provided');
    });

    it('should throw an error if provided coordinates are in string format', () => {
      const resultFn = () => new Cell('0,0');
      expect(resultFn).toThrow('Invalid coordinates provided');
    });
  });

  describe('setState()', () => {
    it('should correctly update state with valid keys', () => {
      cell.setState({
        isShown: true,
        isMine: true,
        isFlagged: true,
        surroundingMinesCount: 1,
      });
      expect(cell.isShown).toBe(true);
      expect(cell.isMine).toBe(true);
      expect(cell.isFlagged).toBe(true);
      expect(cell.surroundingMinesCount).toBe(1);
    });

    it('should not update state with invalid keys', () => {
      cell.setState({
        invalidKey: true,
      });
      expect(cell.invalidKey).toBeUndefined();
    });

    it('should not update state with no keys', () => {
      const prevState = { ...cell };
      cell.setState({});
      expect(cell).toEqual(prevState);
    });

    it('should handle undefined updates', () => {
      const prevState = { ...cell };
      cell.setState();
      expect(cell).toEqual(prevState);
    });

    it('should correctly update state with mixed valid and invalid keys', () => {
      cell.setState({
        isShown: true,
        invalidKey: true,
      });
      expect(cell.isShown).toBe(true);
      expect(cell.invalidKey).toBeUndefined();
    });
  });

  describe('incrementSurroundingMinesCount', () => {
    it('should increment surroundingMinesCount by 1', () => {
      const initialCount = cell.surroundingMinesCount;
      cell.incrementSurroundingMinesCount();
      expect(cell.surroundingMinesCount).toBe(initialCount + 1);
    });

    it('should increment surroundingMinesCount correctly multiple times', () => {
      const times = 5;
      for (let i = 0; i < times; i++) cell.incrementSurroundingMinesCount();
      expect(cell.surroundingMinesCount).toBe(times);
    });
  });

  describe('onCellClick', () => {
    it('should not do anything if cell is flagged', () => {
      cell.setState({ isFlagged: true });
      const prevState = { ...cell };
      cell.onCellClick();
      expect(cell).toEqual(prevState);
    });

    it('should set isMine to true and surroundingMinesCount to 0 if isManualMineSetting is true', () => {
      cell.onCellClick({ isManualMineSetting: true });
      expect(cell.isMine).toBe(true);
      expect(cell.surroundingMinesCount).toBe(0);
    });

    it('should set isShown to true if isManualMineSetting is false or not provided', () => {
      cell.onCellClick();
      expect(cell.isShown).toBe(true);
    });
  });

  describe('onCellRightClick', () => {
    it('should toggle isFlagged', () => {
      const prevState = cell.isFlagged;
      cell.onCellRightClick();
      expect(cell.isFlagged).toBe(!prevState);
    });

    it('should return isFlagged', () => {
      expect(cell.onCellRightClick()).toBe(cell.isFlagged);
    });
  });

  describe('clone', () => {
    beforeEach(() => {
      cell = new Cell({ rowIdx: 1, columnIdx: 1 });
      cell.setState({
        isShown: true,
        isMine: true,
        isFlagged: true,
        surroundingMinesCount: 4,
      });
    });

    it('should return a new Cell object with the same state', () => {
      const clonedCell = cell.clone();
      expect(clonedCell).not.toBe(cell);
      expect(clonedCell).toEqual(cell);
    });
  });

  describe('render', () => {
    let cellElement;
    beforeEach(() => {
      const { rowIdx, columnIdx } = cell.coords;
      cellElement = document.querySelector(`#cell-${rowIdx}-${columnIdx}`);
    });

    it('should render the MINE_IMG in the element if isMine is true', () => {
      cell.setState({ isShown: true, isMine: true });
      cell.render();

      const div = document.createElement('div');
      div.innerHTML = MINE_IMG;
      const normalizedMINE_IMG = div.innerHTML;

      expect(cellElement.innerHTML).toEqual(normalizedMINE_IMG);
    });
  });
});
