import Board from './board.js';
import {
  timerElement,
  safeClickCountElement,
  smileyContainerElement,
  livesContainerElement,
  hintsContainerElement,
  bestScoreElement,
  flagCounterElement,
} from '../dom-elements.js';
import { HEART_IMG, SMILEY_WIN_IMG, SMILEY_LOSE_IMG, SMILEY_MONOCLE_IMG } from '../constants.js';
import { getRandomInt } from '../utils';



class AppState {
  getState(name) {
    return this[name];
  }

  EASY = {
    name: 'EASY',
    board: new Board(8),
    lives: 1,
    minesCount: 12,
    flagCount: 12,
    boardSqrt: 8,
    safeClickCount: 1,
    hintsCount: 1,
  };
  MEDIUM = {
    name: 'MEDIUM',
    board: new Board(12),
    lives: 3,
    minesCount: 30,
    flagCount: 30,
    boardSqrt: 12,
    safeClickCount: 3,
    hintsCount: 3,
  };
  HARD = {
    name: 'HARD',
    board: new Board(16),
    lives: 5,
    minesCount: 64,
    flagCount: 64,
    boardSqrt: 16,
    safeClickCount: 5,
    hintsCount: 5,
  };
}

class App {
  constructor() {
    this.renderApp();
  }

  renderApp() {
    this.state.board.renderBoard();
    this.renderFlagCounter();
    this.renderLives();
    this.#renderTimer();
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
      hints += `<button class="hint inset-border" data-idx="${i}">${SMILEY_MONOCLE_IMG}</button>`;
    }
    hintsContainerElement.innerHTML = hints;
  }

  #setTimer() {
    this.currGameTime++;
    const minutes = Math.floor(this.currGameTime / 60);
    const seconds = this.currGameTime % 60;
    return { minutes, seconds };
  }

  #renderTimer(time) {
    if (!time) {
      timerElement.innerHTML = '000';
      return;
    }
    const { minutes, seconds } = time;
    const formattedMinutes = minutes.toString();
    const formattedSeconds = seconds.toString().padStart(2, '0');
    timerElement.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
  }

  setFlagCounter(isFlagged) {
    if (isFlagged) this.state.flagCount--;
    else this.state.flagCount++;
    this.renderFlagCounter();
  }

  renderFlagCounter() {
    const { flagCount } = this.state;
    const paddingNum = flagCount >= 0 ? 3 : 0;
    const formmatedFlagCount = flagCount.toString().padStart(paddingNum, '0');
    flagCounterElement.innerHTML = `${formmatedFlagCount}`;
  }

  renderLives() {
    if (!this.isTimerRunning) {
      livesContainerElement.innerHTML = '';
      for (let i = 0; i < this.state.lives; i++) livesContainerElement.innerHTML += `${HEART_IMG}`;
      return;
    }

    const children = livesContainerElement.children;
    [...children].reverse().forEach((child, idx) => {
      if (idx >= this.state.lives) child.style.opacity = '0';
    });
  }

  handleBtnSetMinesManuallyClick() {
    this.isManualMineSetting = true;
  }

  handleBtnSetSevenBoomClick() {
    clearInterval(this.intervalTimerId);
    this.isTimerRunning = false;
    this.state.board.setBoard();
    this.renderApp();

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
    this.renderApp();
  }

  handleSmileyClick() {
    console.log('smiley clicked', this.state);
    this.state = new AppState().getState(this.state.name);
    this.prevState = new AppState().getState(this.state.name);
    this.stateHistory = [];
    clearInterval(this.intervalTimerId);
    this.currGameTime = 0;
    this.isTimerRunning = false;
    this.isMinesSet = false;
    this.isClickHint = false;
    this.isManualMineSetting = false;
    this.renderApp();
  }

  handleBtnSafeClick() {
    if (!this.state.safeClickCount) return;
    if (!this.isMinesSet) this.state.board.setMines(this.state.minesCount);
    this.state.safeClickCount--;
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
    const copy = { ...state, board: this.state.board.clone() };
    this.stateHistory.push(this.prevState);
    this.prevState = copy;
  }

  handleBtnUndoActionClick() {
    if (!this.stateHistory.length) {
      const { name } = this.state;
      this.state = new AppState().getState(name);
    } else {
      const lastStateSnapshot = this.stateHistory.pop();
      this.state = lastStateSnapshot;
    }

    this.state.board.renderBoard();
    this.renderFlagCounter();
    this.renderLives();
    this.#renderSafeClickCount();
    this.#renderHints();
  }

  handleGameStart() {
    if (this.isTimerRunning) return;
    if (!this.isMinesSet) this.state.board.setMines(this.state.minesCount);
    this.isMinesSet = true;
    timerElement.innerHTML = '0:00';
    this.intervalTimerId = setInterval(() => {
      const time = this.#setTimer();
      this.#renderTimer(time);
    }, 1000);
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

    smileyContainerElement.innerHTML = SMILEY_LOSE_IMG;
  }

  #handleGameWin() {
    this.#setBestScore();
    clearInterval(this.intervalTimerId);
    smileyContainerElement.innerHTML = SMILEY_WIN_IMG;
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
      if ((cell.isMine && cell.isFlagged) || cell.isShown) victoryCount--;
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

export default App;
