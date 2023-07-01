import { FLAG_IMG, MINE_IMG } from '../image-assets.js';

class Cell {
  isShown = false;
  isMine = false;
  isFlagged = false;
  surroundingMinesCount = 0;

  constructor(coords) {
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
    if (this.isHint) cellElement.style.backgroundColor = 'var(--hint-color)';
    if (this.isMine) {
      cellElement.innerHTML = MINE_IMG;
      cellElement.style.backgroundColor = 'var(--mine-color)';
    }
    if (this.surroundingMinesCount) {
      cellElement.classList.add(`num-${this.surroundingMinesCount}`);
      cellElement.innerHTML = this.surroundingMinesCount;
    }
    cellElement.classList.add('showned');
    cellElement.innerHTML = this.#getShownCellContent();
  }

  #renderHiddenCell(cellElement, isSafeClick) {
    cellElement.classList.remove('showned');
    if (isSafeClick) cellElement.style.backgroundColor = 'rgb(56, 148, 197)';
    else cellElement.style.backgroundColor = '';
    cellElement.innerHTML = this.isFlagged ? FLAG_IMG : '';
  }

  #getCellElement() {
    const { rowIdx, columnIdx } = this.coords;
    return document.querySelector(`#cell-${rowIdx}-${columnIdx}`);
  }
}

export default Cell;
