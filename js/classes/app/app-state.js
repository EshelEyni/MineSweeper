import Board from '../board.js';

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

  setState(newState) {
    Object.assign(this, newState);
  }

  setTimer() {
    this.incrementTimer();
    const minutes = Math.floor(this.gameTime / 60);
    const seconds = this.gameTime % 60;
    return { minutes, seconds };
  }

  startGame() {
    if (this.isTimerRunning) return;
    if (!this.isMinesSet) this.board.setMines(this.minesCount);
    this.toggleIsMinesSet();
    this.toggleIsTimerRunning();
  }

  onGameLoss() {
    clearInterval(this.intervalTimerId);
    this.isTimerRunning = false;

    this.board.loopThroughCells(cell => {
      if (cell.isMine) {
        cell.isShown = true;
        cell.render();
      }
    });

    smileyContainerElement.innerHTML = SMILEY_LOSE_IMG;
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
    this.#setBestScore();
    clearInterval(this.intervalTimerId);
    this.isTimerRunning = false;
  }

  #setBestScore() {
    const { difficultyName } = this;
    const prevBestScore = window.localStorage.getItem(difficultyName);
    const endGameTime = (Date.now() - this.gameTime) / 1000;
    if (prevBestScore !== null && parseFloat(prevBestScore) < endGameTime) return;
    window.localStorage.setItem(difficultyName, endGameTime);
  }
}

export default AppState;
