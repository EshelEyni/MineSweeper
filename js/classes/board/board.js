import Cell from '../cell/cell.js';
import { getRandomUniqueNumbers } from '../../utils/utils.js';
import { boardTable } from '../../dom-elements.js';

class Board {
  board = [];

  constructor(boardSqrt) {
    this.boardSqrt = boardSqrt;
    this.setBoard();
  }

  setBoard() {
    this.board = Array(this.boardSqrt)
      .fill()
      .map((_, rowIdx) =>
        Array(this.boardSqrt)
          .fill()
          .map(
            (_, columnIdx) =>
              new Cell({
                rowIdx,
                columnIdx,
              })
          )
      );
  }

  setRandomMines(minesCount) {
    const { boardSqrt } = this;
    const totalCells = boardSqrt ** 2;
    const randomCoords = getRandomUniqueNumbers(totalCells, minesCount).map(randomCoord => {
      const rowIdx = Math.floor(randomCoord / boardSqrt);
      const columnIdx = randomCoord % boardSqrt;
      return { rowIdx, columnIdx };
    });

    randomCoords.forEach(({ rowIdx, columnIdx }) => {
      const cell = this.board[rowIdx][columnIdx];
      cell.isMine = true;
    });

    randomCoords.forEach(({ rowIdx, columnIdx }) => {
      this.setSurroundingMineCount(rowIdx, columnIdx);
    });
  }

  revealSurroundingTargetCells(targetRowIdx, targetColumnIdx) {
    const { board } = this;
    const targetCell = board[targetRowIdx][targetColumnIdx];
    if (targetCell.surroundingMinesCount) return;

    const surroundingCells = this.#getSurroundingCells(targetRowIdx, targetColumnIdx, {
      excludeDiagonalCells: true,
    });

    surroundingCells.forEach(cell => {
      const { rowIdx, columnIdx } = cell.coords;
      const isRecurse = !cell.surroundingMinesCount && !cell.isShown;
      if (cell.isMine) return;
      cell.setState({ isShown: true });
      cell.render(rowIdx, columnIdx);
      if (!isRecurse) return;
      this.revealSurroundingTargetCells(rowIdx, columnIdx);
    });
  }

  setSurroundingMineCount(rowIdx, columnIdx) {
    this.loopThroughCells(cell => {
      if (cell.isMine) return;

      const { rowIdx: cellRowIdx, columnIdx: cellColumnIdx } = cell.coords;
      const isSurroundingCell =
        cellRowIdx >= rowIdx - 1 &&
        cellRowIdx <= rowIdx + 1 &&
        cellColumnIdx >= columnIdx - 1 &&
        cellColumnIdx <= columnIdx + 1;

      if (isSurroundingCell) cell.incrementSurroundingMinesCount();
    });
  }

  handleHintCellClick(targetRowIdx, targetColumnIdx) {
    const hintedCells = this.#getSurroundingCells(targetRowIdx, targetColumnIdx);

    hintedCells.forEach(cell => {
      if (cell.isShown) return;
      cell.setState({ isShown: true, isHint: true });
      cell.render();
    });

    setTimeout(() => {
      hintedCells.forEach(cell => {
        if (!cell.isHint) return;
        cell.setState({ isShown: false, isHint: false });
        cell.render();
      });
    }, 2500);
  }

  loopThroughCells(callback) {
    const { board } = this;
    board.forEach((row, rowIdx) => {
      row.forEach((_, columnIdx) => {
        const cell = board[rowIdx][columnIdx];
        callback(cell);
      });
    });
  }

  clone() {
    const newBoard = new Board(this.boardSqrt);
    newBoard.board = this.board.map(row => row.map(cell => cell.clone()));
    return newBoard;
  }

  renderBoard() {
    const rows = this.board
      .map(row => {
        const cells = row
          .map(cell => {
            const { rowIdx, columnIdx } = cell.coords;
            return `<td class="cell inset-border" data-row-idx="${rowIdx}" data-column-idx="${columnIdx}" id="cell-${rowIdx}-${columnIdx}"></td>`;
          })
          .join('');

        return `<tr>${cells}</tr>`;
      })
      .join('');

    const strHTML = `<tbody>${rows}</tbody>`;
    boardTable.innerHTML = strHTML;

    this.loopThroughCells(cell => cell.render());
  }

  #getSurroundingCells(
    targetRowIdx,
    targetColumnIdx,
    { excludeTargetCell = false, excludeDiagonalCells = false } = {}
  ) {
    const surroundingCells = [];

    const isLegitCell = (rowIdx, columnIdx) => {
      const isSurroundingCell =
        rowIdx >= targetRowIdx - 1 &&
        rowIdx <= targetRowIdx + 1 &&
        columnIdx >= targetColumnIdx - 1 &&
        columnIdx <= targetColumnIdx + 1;

      return (
        isSurroundingCell &&
        (!excludeTargetCell || (rowIdx !== targetRowIdx && columnIdx !== targetColumnIdx)) &&
        (!excludeDiagonalCells || rowIdx === targetRowIdx || columnIdx === targetColumnIdx)
      );
    };

    this.loopThroughCells(cell => {
      const { rowIdx, columnIdx } = cell.coords;
      if (!isLegitCell(rowIdx, columnIdx)) return;
      surroundingCells.push(cell);
    });

    return surroundingCells;
  }
}

export default Board;
