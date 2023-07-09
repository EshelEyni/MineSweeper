import Cell from './cell.js';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { FLAG_IMG, MINE_IMG } from '../../image-assets';
import { jsdom } from '../../test-dom';

describe('Cell', () => {
  let cell;
  const [rowIdx, columnIdx] = [1, 1];

  beforeAll(() => {
    global.window = jsdom.window;
    global.document = jsdom.window.document;
    const boardTable = document.querySelector('.board');
    boardTable.innerHTML = `
    <tbody>
      <tr>
      <td class="cell inset-border" data-row-idx="${rowIdx}" data-column-idx="${columnIdx}" id="cell-${rowIdx}-${columnIdx}"></td>
      <tr/>
    <tbody/>
     `;
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

  beforeEach(() => {
    cell = new Cell({ rowIdx, columnIdx });
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

    it('should set isMine to true, surroundingMinesCount to 0 and change the background color to --mine-color if isManualMineSetting is true', () => {
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
    it('should return a new Cell object with the same state', () => {
      cell = new Cell({ rowIdx: 1, columnIdx: 1 });
      cell.setState({
        isShown: true,
        isMine: true,
        isFlagged: true,
        surroundingMinesCount: 4,
      });
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

    describe('isShown is true', () => {
      it('should add the showned class to the element', () => {
        cell.setState({ isShown: true });
        cell.render();
        const classListArray = Array.from(cellElement.classList);
        expect(classListArray).toContain('showned');
      });

      it('should render correctly when cellContent is falsey', () => {
        cell.setState({ isShown: true, isMine: false });
        cell.render();
        expect(cellElement.innerHTML).toEqual('');
      });

      it('should render correctly when isMine is true', () => {
        cell.setState({ isShown: true, isMine: true });
        cell.render();

        const div = document.createElement('div');
        div.innerHTML = MINE_IMG;
        const normalizedMINE_IMG = div.innerHTML;

        const { backgroundColor } = cellElement.style;
        const expectedColor = document.documentElement.style.getPropertyValue('--mine-color');

        expect(backgroundColor).toEqual(expectedColor);
        expect(cellElement.innerHTML).toEqual(normalizedMINE_IMG);
      });

      it('should render correctly if surroundingMinesCount truthy', () => {
        cell.setState({ isShown: true, isMine: false, surroundingMinesCount: 4 });
        cell.render();
        const classListArray = Array.from(cellElement.classList);
        expect(classListArray).toContain(`num-${cell.surroundingMinesCount}`);
        expect(cellElement.innerHTML).toEqual('4');
      });

      it('should render correctly if surroundingMinesCount is 0', () => {
        cell.setState({ isShown: true, isMine: false, surroundingMinesCount: 0 });
        cell.render();
        const classListArray = Array.from(cellElement.classList);
        expect(classListArray).not.toContain(`num-${cell.surroundingMinesCount}`);
        expect(cellElement.innerHTML).toEqual('');
      });

      it('should render correctly when isHint is true', () => {
        cell.setState({ isShown: true, isMine: false, isHint: true });
        cell.render();
        const { backgroundColor } = cellElement.style;
        const expectedColor = document.documentElement.style.getPropertyValue('--hint-color');
        expect(backgroundColor).toEqual(expectedColor);
      });
    });

    describe('isShown is false', () => {
      it('should not add the showned class to the element', () => {
        cell.setState({ isShown: false });
        cell.render();
        const classListArray = Array.from(cellElement.classList);
        expect(classListArray).not.toContain('showned');
      });

      it('should remove the showned class from the element', () => {
        cell.setState({ isShown: true });
        cell.render();
        cell.setState({ isShown: false });
        cell.render();
        const classListArray = Array.from(cellElement.classList);
        expect(classListArray).not.toContain('showned');
      });

      it('should render correctly when isFlagged is true', () => {
        cell.setState({ isShown: false, isFlagged: true });
        cell.render();
        const div = document.createElement('div');
        div.innerHTML = FLAG_IMG;
        const normalizedFLAG_IMG = div.innerHTML;
        expect(cellElement.innerHTML).toEqual(normalizedFLAG_IMG);
      });

      it('should render correctly when isFlagged is false', () => {
        cell.setState({ isShown: false, isFlagged: false });
        cell.render();
        expect(cellElement.innerHTML).toEqual('');
      });

      it('should render correctly when isSafeClick is true', () => {
        cell.setState({ isShown: false, isFlagged: false });
        cell.render({ isSafeClick: true });
        const { backgroundColor } = cellElement.style;
        const expectedColor = document.documentElement.style.getPropertyValue('--safe-click-color');
        expect(backgroundColor).toEqual(expectedColor);
      });

      it('should render correctly when isSafeClick is false', () => {
        cell.setState({ isShown: false, isFlagged: false });
        cell.render({ isSafeClick: false });
        const { backgroundColor } = cellElement.style;
        const expectedColor = '';
        expect(backgroundColor).toEqual(expectedColor);
      });

      it('should render correctly when isManualMine is true', () => {
        cell.setState({ isShown: false, isFlagged: false });
        cell.render({ isManualMine: true });
        const { backgroundColor } = cellElement.style;
        const expectedColor = document.documentElement.style.getPropertyValue('--mine-color');
        expect(backgroundColor).toEqual(expectedColor);
      });

      it('should render correctly when isManualMine is false', () => {
        cell.setState({ isShown: false, isFlagged: false });
        cell.render({ isManualMine: false });
        const { backgroundColor } = cellElement.style;
        const expectedColor = '';
        expect(backgroundColor).toEqual(expectedColor);
      });
    });
  });

  describe('renderCheat', () => {
    let cellElement;

    beforeEach(() => {
      const { rowIdx, columnIdx } = cell.coords;
      cellElement = document.querySelector(`#cell-${rowIdx}-${columnIdx}`);
      cell.setState({ isMine: true });
    });

    afterEach(() => {
      cellElement.innerHTML = '';
      cellElement.classList.remove('cheat');
    });

    it('should update innerHTML of cellElement', () => {
      const oldInnerHTML = cellElement.innerHTML;
      cell.renderCheat();
      const newInnerHTML = cellElement.innerHTML;
      expect(newInnerHTML).not.toEqual(oldInnerHTML);
    });

    it('should toggle the cheat class of cellElement', () => {
      const oldClassList = [...cellElement.classList];
      expect(oldClassList).not.toContain('cheat');
      cell.renderCheat();
      const newClassList = [...cellElement.classList];
      expect(newClassList).toContain('cheat');
      cell.renderCheat();
      const updatedClassList = [...cellElement.classList];
      expect(updatedClassList).not.toContain('cheat');
    });

    it('should clear the innerHTML of cellElement after toggling twice', () => {
      cell.renderCheat();
      cell.renderCheat();
      expect(cellElement.innerHTML).toEqual('');
    });
  });
});
