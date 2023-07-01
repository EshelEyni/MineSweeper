import {
  timerElement,
  safeClickCountElement,
  smileyContainerElement,
  livesContainerElement,
  hintsContainerElement,
  bestScoreContainer,
  flagCounterElement,
  btnSetMinesManually,
} from '../../dom-elements.js';
import {
  HEART_IMG,
  SMILEY_IMG,
  SMILEY_WIN_IMG,
  SMILEY_LOSE_IMG,
  SMILEY_MONOCLE_IMG,
  SMILEY_SHOCKED_IMG,
} from '../../image-assets.js';

class AppRenderer {
  constructor(appState) {
    this.appState = appState;
  }

  app({ isUndoAction = false } = {}) {
    this.safeClickCount();
    this.hints();
    this.appState.board.renderBoard();
    this.lives();
    this.flagCounter();
    if (isUndoAction) return;
    this.timer();
    this.bestScore();
  }

  safeClickCount() {
    const { safeClickCount } = this.appState;
    if (safeClickCount >= 0) {
      safeClickCountElement.innerHTML = `${safeClickCount}`;
    }
  }

  hints() {
    const { hintsCount } = this.appState;
    let hints = '';
    for (let i = 0; i < hintsCount; i++) {
      hints += `<button class="hint inset-border" data-idx="${i}">${SMILEY_MONOCLE_IMG}</button>`;
    }
    hintsContainerElement.innerHTML = hints;
  }

  bestScore() {
    const { difficultyName } = this.appState;
    const previousBestScore = window.localStorage.getItem(difficultyName);
    if (previousBestScore === null) {
      bestScoreContainer.innerHTML = `<span>BEST SCORE: 00:00</span>`;
      return;
    }
    const minutes = Math.floor(previousBestScore / 60);
    const seconds = previousBestScore % 60;
    bestScoreContainer.innerHTML = `<span>BEST SCORE: ${minutes}:${seconds}</span>`;
  }

  lives() {
    if (!this.isTimerRunning) {
      let lives = '';
      for (let i = 0; i < this.appState.lives; i++) lives += `${HEART_IMG}`;
      livesContainerElement.innerHTML = lives;
      return;
    }

    const children = livesContainerElement.children;
    [...children].reverse().forEach((child, idx) => {
      if (idx >= this.appState.lives) child.style.opacity = '0';
    });
  }

  smileyLoss() {
    smileyContainerElement.innerHTML = SMILEY_LOSE_IMG;
  }

  smileyWin() {
    smileyContainerElement.innerHTML = SMILEY_WIN_IMG;
  }

  smileyShocked() {
    smileyContainerElement.innerHTML = SMILEY_SHOCKED_IMG;
  }

  smileyDefault() {
    smileyContainerElement.innerHTML = SMILEY_IMG;
  }

  toggleBtnActiveSetMinesManually() {
    btnSetMinesManually.classList.toggle('active');
  }

  flagCounter() {
    const { flagCount } = this.appState;
    const paddingNum = flagCount >= 0 ? 3 : 0;
    const formmatedFlagCount = flagCount.toString().padStart(paddingNum, '0');
    flagCounterElement.innerHTML = `${formmatedFlagCount}`;
  }

  timer(time) {
    if (!time) {
      timerElement.innerHTML = '000';
      return;
    }
    const { minutes, seconds } = time;
    const formattedMinutes = minutes.toString();
    const formattedSeconds = seconds.toString().padStart(2, '0');
    timerElement.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
  }
}

export default AppRenderer;
