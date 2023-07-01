import Board from '../board/board.js';

const GameConfig = {
  easy: {
    difficultyName: 'easy',
    lives: 1,
    minesCount: 12,
    flagCount: 12,
    boardSqrt: 8,
    safeClickCount: 1,
    hintsCount: 1,
  },
  medium: {
    difficultyName: 'medium',
    lives: 3,
    minesCount: 30,
    flagCount: 30,
    boardSqrt: 12,
    safeClickCount: 3,
    hintsCount: 3,
  },
  hard: {
    difficultyName: 'hard',
    lives: 5,
    minesCount: 64,
    flagCount: 64,
    boardSqrt: 16,
    safeClickCount: 5,
    hintsCount: 5,
  },
};

class AppState {
  constructor(difficulty = 'medium') {
    Object.assign(this, GameConfig[difficulty]);
    this.board = new Board(this.boardSqrt);
    this.intervalTimerId;
    this.gameTime = 0;
    this.isTimerRunning = false;
    this.isClickHint = false;
    this.isManualMineSetting = false;
    this.isMinesSet = false;
  }

  incrementTimer() {
    this.gameTime++;
  }

  incrementFlagCount() {
    this.flagCount++;
  }

  decrementFlagCount() {
    this.flagCount--;
  }

  decrementSafeClickCount() {
    this.safeClickCount--;
  }

  decrementHintsCount() {
    this.hintsCount--;
  }

  decrementLives() {
    this.lives--;
  }

  decrementMinesCount() {
    this.minesCount--;
  }

  toggleIsMinesSet() {
    this.isMinesSet = !this.isMinesSet;
  }

  toggleIsManualMineSetting() {
    this.isManualMineSetting = !this.isManualMineSetting;
  }

  toggleIsClickHint() {
    this.isClickHint = !this.isClickHint;
  }

  toggleIsTimerRunning() {
    this.isTimerRunning = !this.isTimerRunning;
  }

  setTimer() {
    this.incrementTimer();
    const minutes = Math.floor(this.gameTime / 60);
    const seconds = this.gameTime % 60;
    return { minutes, seconds };
  }

  setPrevState(prevState) {
    Object.assign(this, prevState);
  }

  startGame() {
    if (this.isTimerRunning) return;
    if (!this.isMinesSet) this.board.setRandomMines(this.minesCount);
    this.toggleIsMinesSet();
    this.toggleIsTimerRunning();
  }

  onGameLoss() {
    this.#resetTimer();
    this.board.loopThroughCells(cell => {
      if (cell.isMine) {
        cell.setState({ isShown: true });
        cell.render();
      }
    });
  }

  verifyGameVictory() {
    const { boardSqrt } = this;
    let victoryCount = Math.pow(boardSqrt, 2);
    this.board.loopThroughCells(cell => {
      if ((cell.isMine && cell.isFlagged) || cell.isShown) victoryCount--;
    });

    const isVictory = victoryCount === 0;
    if (isVictory) this.#onGameWin();
    return isVictory;
  }

  #onGameWin() {
    this.#resetTimer();
    this.#setBestScore();
  }

  #setBestScore() {
    const { difficultyName } = this;
    const storageValue = window.localStorage.getItem(difficultyName);
    const prevBestScore = storageValue ? Number(storageValue) : null;
    const isBestScore = prevBestScore === null || prevBestScore > this.gameTime;
    if (!isBestScore) return;
    window.localStorage.setItem(difficultyName, this.gameTime);
  }

  #resetTimer() {
    clearInterval(this.intervalTimerId);
    this.toggleIsTimerRunning();
  }
}

export default AppState;
