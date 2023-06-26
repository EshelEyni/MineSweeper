class Cell {
  isShown = false;
  isMine = false;
  isFlagged = false;
  surroundingMinesCount = 0;

  constructor(coords) {
    this.coords = coords;
  }

  setState({ isShown, isMine, isFlagged, surroundingMinesCount }) {
    if (isShown) this.isShown = isShown;
    if (isMine) this.isMine = isMine;
    if (isFlagged) this.isFlagged = isFlagged;
    if (surroundingMinesCount) this.surroundingMinesCount = surroundingMinesCount;
  }

  render({ isSafeClick = false } = {}) {
    const elCell = this.getCellElement();
    if (this.isShown) this.#renderShownCell(elCell);
    else this.#renderHiddenCell(elCell, isSafeClick);
  }

  #renderShownCell(elCell) {
    if (this.isHint) elCell.style.backgroundColor = 'rgb(233, 214, 111)';
    if (this.isMine) elCell.style.backgroundColor = 'red';
    if (this.surroundingMinesCount) elCell.classList.add(`num-${this.surroundingMinesCount}`);
    elCell.classList.add('showned');
    elCell.innerHTML = this.getShownCellContent();
  }

  #renderHiddenCell(elCell, isSafeClick) {
    elCell.classList.remove('showned');
    if (isSafeClick) elCell.style.backgroundColor = 'rgb(56, 148, 197)';
    else elCell.style.backgroundColor = '';
    elCell.innerHTML = this.isFlagged ? FLAG_IMG : '';
  }

  getShownCellContent() {
    if (this.surroundingMinesCount) return this.surroundingMinesCount;
    if (this.isMine) return MINE_IMG;
    return '';
  }

  handleCellClick({ isManualMineSetting = false } = {}) {
    if (isManualMineSetting) {
      this.isMine = true;
      this.surroundingMinesCount = 0;
      return;
    }
    if (this.isFlagged) return;
    this.isShown = true;

    const elCell = this.getCellElement();

    if (this.isMine) {
      elCell.innerHTML = MINE_IMG;
      elCell.style.backgroundColor = 'red';
      return;
    }
    this.render();

    if (this.surroundingMinesCount && !this.isMine) {
      elCell.innerHTML = this.surroundingMinesCount;
    }
  }

  handleCellRightClick() {
    this.isFlagged = !this.isFlagged;
    this.render();
    return this.isFlagged;
  }

  getCellElement() {
    const { rowIdx, columnIdx } = this.coords;
    return document.querySelector(`#cell-${rowIdx}-${columnIdx}`);
  }
}
