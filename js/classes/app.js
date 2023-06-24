'use strict';

class AppState {
  getState(name) {
    return this[name];
  }

  EASY = {
    name: 'EASY',
    board: new Board(8),
    lives: 1,
    minesCount: 12,
    boardSqrt: 8,
    safeClickCount: 1,
    hintsCount: 1,
  };
  MEDIUM = {
    name: 'MEDIUM',
    board: new Board(12),
    lives: 3,
    minesCount: 30,
    boardSqrt: 12,
    safeClickCount: 3,
    hintsCount: 3,
  };
  HARD = {
    name: 'HARD',
    board: new Board(16),
    lives: 5,
    minesCount: 64,
    boardSqrt: 16,
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

    const formattedMinutes = minutes.toString();
    const formattedSeconds = seconds.toString().padStart(2, '0');

    timerElement.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
  }

  renderLives() {
    livesElement.innerHTML = `Number of lifes: `;
    for (let i = 0; i < this.state.lives; i++) {
      livesElement.innerHTML += `${HEART_EMOJY}`;
    }
  }

  handleBtnSetMinesManuallyClick() {
    this.isManualMineSetting = true;
  }

  handleBtnSetSevenBoomClick() {
    clearInterval(this.intervalTimerId);
    this.isTimerRunning = false;
    timerElement.innerHTML = '000';
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

    timerElement.innerHTML = '000';
    this.render();
  }

  handleSmileyClick() {
    smileyElement.innerHTML = SMILEY_IMG;
    clearInterval(this.intervalTimerId);
    this.isTimerRunning = false;
    this.isMinesSet = false;
    const { boardSqrt } = this.state;
    this.state.board = new Board(boardSqrt);

    timerElement.innerHTML = '000';
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

    smileyElement.innerHTML = LOSE_IMG;
  }

  #handleGameWin() {
    this.#setBestScore();
    clearInterval(this.intervalTimerId);
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
