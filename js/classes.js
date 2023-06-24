'use strict';

class AppState {
  getState(name) {
    return this[name];
  }

  EASY = {
    name: 'EASY',
    board: new Board(4),
    lives: 1,
    minesCount: 2,
    boardSqrt: 4,
    safeClickCount: 1,
    hintsCount: 1,
  };
  MEDIUM = {
    name: 'MEDIUM',
    board: new Board(8),
    lives: 3,
    minesCount: 12,
    boardSqrt: 8,
    safeClickCount: 3,
    hintsCount: 3,
  };
  HARD = {
    name: 'HARD',
    board: new Board(12),
    lives: 5,
    minesCount: 30,
    boardSqrt: 12,
    safeClickCount: 5,
    hintsCount: 5,
  };
}

class App {
  constructor() {
    this.render();
  }

  render() {
    this.state.board.renderBoard();
    this.renderLives();
    this.#renderSafeClickCount();
    this.#renderHints();
    this.#renderBestScore();
  }

  #renderBestScore() {
    const { boardSqrt } = this.state;
    const scoreKey = 'BestScoreLevel=' + boardSqrt;
    const previousBestScore = window.localStorage.getItem(scoreKey);
    if (previousBestScore === null) {
      bestScoreElement.innerHTML = `BEST SCORE: 00:00`;
      return;
    }
    bestScoreElement.innerHTML = `BEST SCORE: ${previousBestScore}`;
  }

  #renderSafeClickCount() {
    const { safeClickCount } = this.state;
    if (safeClickCount >= 0) {
      safeClickCountElement.innerHTML = `${safeClickCount}`;
    }
  }

  #renderHints() {
    const { hintsCount } = this.state;
    let hints = '';
    for (let i = 0; i < hintsCount; i++) {
      hints += `<button class="hint" data-idx="${i}">Hint</button>`;
    }
    hintsContainerElement.innerHTML = hints;
  }

  #setAndRenderTimer() {
    this.currGameTime++;
    const minutes = Math.floor(this.currGameTime / 60);
    const seconds = this.currGameTime % 60;

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    timerElement.innerHTML = `GAME TIME: ${formattedMinutes}:${formattedSeconds}`;
  }

  renderLives() {
    livesElement.innerHTML = `Number of lifes: `;
    for (let i = 0; i < this.state.lives; i++) {
      livesElement.innerHTML += `${LIVE_IMG}`;
    }
  }

  handleBtnSetMinesManuallyClick() {
    this.isManualMineSetting = true;
  }

  handleBtnSetSevenBoomClick() {
    clearInterval(this.intervalTimerId);
    this.isTimerRunning = false;
    timerElement.style.display = 'none';
    resultElement.style.display = 'none';
    this.state.board.setBoard();
    this.state.board.renderBoard();
    this.render();

    let index = 1;
    this.state.board.loopThroughCells(cell => {
      const digitSevenExists = () => {
        const separatedDigits = index.toString().split('');
        return separatedDigits.some(digit => digit === '7');
      };
      if (index % 7 === 0 || digitSevenExists()) cell.isMine = true;
      index++;
    });
  }

  toggleIsHintClick() {
    this.isClickHint = !this.isClickHint;
  }

  handleSetDifficultyBtnClick(difficultySetting) {
    this.state = new AppState().getState(difficultySetting);
    this.prevState = new AppState().getState(difficultySetting);
    this.stateHistory = [];
    clearInterval(this.intervalTimerId);
    this.currGameTime = 0;
    this.isTimerRunning = false;
    this.isMinesSet = false;
    this.isClickHint = false;
    this.isManualMineSetting = false;

    timerElement.style.display = 'none';
    resultElement.style.display = 'none';
    this.render();
  }

  handleSmileyClick() {
    smileyElement.innerHTML = SMILEY_IMG;
    clearInterval(this.intervalTimerId);
    this.isTimerRunning = false;
    this.isMinesSet = false;
    const { boardSqrt } = this.state;
    this.state.board = new Board(boardSqrt);

    timerElement.style.display = 'none';
    this.render();
  }

  handleBtnSafeClick() {
    if (!safeClickCountElement) return;
    if (!this.isMinesSet) this.state.board.setMines();
    this.safeClickCountElement--;
    this.#renderSafeClickCount();

    const safeCells = [];

    this.state.board.loopThroughCells(cell => {
      if (!cell.isMine && !cell.isShown) safeCells.push(cell);
    });

    if (!safeCells.length) return;

    const safeCell = safeCells[getRandomInt(0, safeCells.length - 1)];
    safeCell.isSafeClick = true;
    safeCell.render({ isSafeClick: true });

    setTimeout(() => {
      safeCell.isSafeClick = false;
      safeCell.render();
    }, 2000);
  }

  setStateHistory() {
    const { state } = this;
    const copy = JSON.parse(JSON.stringify(state));
    Object.setPrototypeOf(copy.board, Board.prototype);
    copy.board.board = state.board.board.map(row => {
      return row.map(cell => {
        const newCell = new Cell(cell.coords);
        newCell.isShown = cell.isShown;
        newCell.isMine = cell.isMine;
        newCell.isMarked = cell.isMarked;
        newCell.surroundingMinesCount = cell.surroundingMinesCount;
        return newCell;
      });
    });

    this.stateHistory.push(this.prevState);
    this.prevState = copy;
  }

  handleBtnUndoActionClick() {
    console.log('this.stateHistory: ', this.stateHistory);
    if (!this.stateHistory.length) {
      const { name } = this.state;
      this.state = new AppState().getState(name);
    } else {
      const lastStateSnapshot = this.stateHistory.pop();
      console.log('lastStateSnapshot: ', lastStateSnapshot);
      this.state = lastStateSnapshot;
    }
    this.render();
  }

  handleGameStart() {
    if (this.isTimerRunning) return;
    if (!this.isMinesSet) this.state.board.setMines(this.state.minesCount);
    this.isMinesSet = true;
    this.#setAndRenderTimer();
    this.intervalTimerId = setInterval(this.#setAndRenderTimer.bind(this), 1000);
    this.isTimerRunning = true;
  }

  handleGameLoss() {
    clearInterval(this.intervalTimerId);
    this.isTimerRunning = false;

    this.state.board.loopThroughCells(cell => {
      if (cell.isMine) {
        cell.isShown = true;
        cell.render();
      }
    });

    resultElement.style.display = 'flex';
    resultElement.innerHTML = 'YOU LOST';
    smileyElement.innerHTML = LOSE_IMG;
  }

  #handleGameWin() {
    this.#setBestScore();
    clearInterval(this.intervalTimerId);
    resultElement.style.display = 'flex';
    resultElement.innerHTML = 'YOU WON';
    smileyElement.innerHTML = WIN_IMG;
  }

  #setBestScore() {
    const { name } = this.state;
    const prevBestScore = window.localStorage.getItem(name);
    const endGameTime = (Date.now() - this.currGameTime) / 1000;
    if (prevBestScore !== null && parseFloat(prevBestScore) < endGameTime) return;
    window.localStorage.setItem(name, endGameTime);
  }

  checkGameVictory() {
    const { boardSqrt } = this.state;
    let victoryCount = Math.pow(boardSqrt, 2);
    this.state.board.loopThroughCells(cell => {
      if ((cell.isMine && cell.isMarked) || cell.isShown) victoryCount--;
    });

    if (victoryCount === 0) this.#handleGameWin();
  }

  // Fields
  state = new AppState().getState('MEDIUM');
  prevState = new AppState().getState('MEDIUM');
  stateHistory = [];
  intervalTimerId;
  currGameTime = 0;
  isTimerRunning = false;
  isClickHint = false;
  isManualMineSetting = false;
  isMinesSet = false;
}

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

  renderBoard() {
    const rows = this.board
      .map(row => {
        const cells = row
          .map(cell => {
            const { rowIdx, columnIdx } = cell.coords;
            return `<td class="cell" data-row-idx="${rowIdx}" data-column-idx="${columnIdx}" id="cell-${rowIdx}-${columnIdx}"></td>`;
          })
          .join('');

        return `<tr>${cells}</tr>`;
      })
      .join('');

    const strHTML = `<table><tbody>${rows}</tbody></table>`;
    gameBoardElement.innerHTML = strHTML;

    this.loopThroughCells(cell => cell.render());
  }

  setMines(minesCount) {
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
      const isRecurse = !cell.isMine && !cell.surroundingMinesCount && !cell.isShown;

      if (cell.isMine === false) {
        cell.isShown = true;
        cell.render(rowIdx, columnIdx);
      }

      if (isRecurse) this.revealSurroundingTargetCells(rowIdx, columnIdx);
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

      if (isSurroundingCell) cell.surroundingMinesCount++;
    });
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
      if (isLegitCell(rowIdx, columnIdx)) surroundingCells.push(cell);
    });

    return surroundingCells;
  }

  handleHintCellClick(targetRowIdx, targetColumnIdx) {
    const hintedCells = this.#getSurroundingCells(targetRowIdx, targetColumnIdx);

    hintedCells.forEach(cell => {
      if (cell.isShown === false) {
        cell.isShown = cell.isHint = true;
        cell.render();
      }
    });

    setTimeout(() => {
      hintedCells.forEach(cell => {
        if (cell.isShown === true) {
          cell.isShown = cell.isHint = false;
          cell.render();
        }
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
}

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
    elCell.style.backgroundColor = this.isHint ? 'rgb(233, 214, 111)' : 'rgb(187, 187, 187)';
    elCell.innerHTML = this.#getShownCellContent();
  }

  #renderHiddenCell(elCell, isSafeClick) {
    elCell.style.backgroundColor = isSafeClick ? 'rgb(56, 148, 197)' : 'gray';
    elCell.innerHTML = this.isMarked ? gFlag : '';
  }

  #getShownCellContent() {
    if (this.surroundingMinesCount) return this.surroundingMinesCount;
    if (this.isMine) return gMine;
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
      elCell.innerHTML = gMine;
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
