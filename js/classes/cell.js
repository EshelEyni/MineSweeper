class Cell {
  isShown = false;
  isMine = false;
  isMarked = false;
  surroundingMinesCount = 0;

  constructor(coords) {
    this.coords = coords;
  }

  setState({ isShown, isMine, isMarked, surroundingMinesCount }) {
    if (isShown) this.isShown = isShown;
    if (isMine) this.isMine = isMine;
    if (isMarked) this.isMarked = isMarked;
    if (surroundingMinesCount) this.surroundingMinesCount = surroundingMinesCount;
  }

  render({ isSafeClick = false } = {}) {
    const elCell = this.#getElCell();
    if (this.isShown) this.#renderShownCell(elCell);
    else this.#renderHiddenCell(elCell, isSafeClick);
  }

  #renderShownCell(elCell) {
    if (this.isHint) elCell.style.backgroundColor = 'rgb(233, 214, 111)';
    if (this.isMine) elCell.style.backgroundColor = 'red';
    elCell.classList.add('showned');
    elCell.innerHTML = this.#getShownCellContent();
  }

  #renderHiddenCell(elCell, isSafeClick) {
    if (isSafeClick) elCell.style.backgroundColor = 'rgb(56, 148, 197)';

    elCell.innerHTML = this.isMarked ? FLAG_EMOJY : '';
  }

  #getShownCellContent() {
    if (this.surroundingMinesCount) return this.surroundingMinesCount;
    if (this.isMine) return MINE_EMOJY;
    return '';
  }

  handleCellClick({ isManualMineSetting = false } = {}) {
    if (isManualMineSetting) {
      this.isMine = true;
      this.surroundingMinesCount = 0;
      return;
    }
    if (this.isMarked) return;
    this.isShown = true;

    const elCell = this.#getElCell();

    if (this.isMine) {
      elCell.innerHTML = MINE_EMOJY;
      elCell.style.backgroundColor = 'red';
      return;
    }
    this.render();

    if (this.surroundingMinesCount && !this.isMine) {
      elCell.innerHTML = this.surroundingMinesCount;
    }
  }

  handleCellRightClick() {
    this.isMarked = !this.isMarked;
    this.render();
  }

  #getElCell() {
    const { rowIdx, columnIdx } = this.coords;
    return document.querySelector(`#cell-${rowIdx}-${columnIdx}`);
  }
}
