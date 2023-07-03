import { FLAG_IMG, MINE_IMG } from '../../image-assets.js';
import { isTestEnv } from '../../utils/utils';

class Cell {
  isShown = false;
  isMine = false;
  isFlagged = false;
  surroundingMinesCount = 0;

  constructor(coords) {
    if (coords === undefined) throw new Error('No coordinates provided');
    if (typeof coords !== 'object') throw new Error('Invalid coordinates provided');
    const { rowIdx, columnIdx } = coords;
    if (typeof rowIdx !== 'number' || typeof columnIdx !== 'number')
      throw new Error('Invalid coordinates provided');
    this.coords = coords;
  }

  setState(updates = {}) {
    const validKeys = ['isShown', 'isMine', 'isFlagged', 'surroundingMinesCount', 'isHint'];

    validKeys.forEach(key => {
      if (key in updates) {
        this[key] = updates[key];
      }
    });
  }

  getState() {
    return {
      coords: this.coords,
      isShown: this.isShown,
      isMine: this.isMine,
      isFlagged: this.isFlagged,
      surroundingMinesCount: this.surroundingMinesCount,
      isHint: this.isHint,
    };
  }

  incrementSurroundingMinesCount() {
    this.surroundingMinesCount++;
  }

  onCellClick({ isManualMineSetting = false } = {}) {
    if (this.isFlagged) return;
    if (isManualMineSetting) {
      this.setState({ isMine: true, surroundingMinesCount: 0 });
      return;
    }
    this.setState({ isShown: true });
    this.render();
  }

  onCellRightClick() {
    this.setState({ isFlagged: !this.isFlagged });
    this.render();
    return this.isFlagged;
  }

  clone() {
    const newCell = new Cell(this.coords);
    newCell.setState({
      isShown: this.isShown,
      isMine: this.isMine,
      isFlagged: this.isFlagged,
      surroundingMinesCount: this.surroundingMinesCount,
    });
    return newCell;
  }

  render({ isSafeClick = false } = {}) {
    const cellElement = this.#getCellElement();
    if (this.isShown) this.#renderShownCell(cellElement);
    else this.#renderHiddenCell(cellElement, isSafeClick);
  }

  renderCheat() {
    const cellElement = this.#getCellElement();
    cellElement.innerHTML = this.#getShownCellContent();
    // rerender to remove the class css effect
    const classListSet = new Set(cellElement.classList);
    if (classListSet.has('cheat')) this.render();
    cellElement.classList.toggle('cheat');
  }

  #getShownCellContent() {
    if (this.surroundingMinesCount) return this.surroundingMinesCount;
    if (this.isMine) return MINE_IMG;
    return '';
  }

  #renderShownCell(cellElement) {
    cellElement.innerHTML = this.#getShownCellContent();
    if (this.isMine)
      cellElement.style.backgroundColor = isTestEnv ? '#d40505cc' : 'var(--mine-color)';
    if (this.surroundingMinesCount) cellElement.classList.add(`num-${this.surroundingMinesCount}`);
    if (this.isHint)
      cellElement.style.backgroundColor = isTestEnv ? '#e9d66f' : 'var(--hint-color)';
    cellElement.classList.add('showned');
  }

  #renderHiddenCell(cellElement, isSafeClick) {
    const classListSet = new Set(cellElement.classList);
    if (classListSet.has('showned')) cellElement.classList.remove('showned');
    if (isSafeClick)
      cellElement.style.backgroundColor = isTestEnv ? '#3894c5' : 'var(--safe-click-color)';
    else cellElement.style.backgroundColor = '';
    cellElement.innerHTML = this.isFlagged ? FLAG_IMG : '';
  }

  #getCellElement() {
    const { rowIdx, columnIdx } = this.coords;
    return document.querySelector(`#cell-${rowIdx}-${columnIdx}`);
  }
}

export default Cell;
