import {
  timerElement,
  safeClickCountElement,
  smileyContainerElement,
  livesContainerElement,
  hintsContainerElement,
  bestScoreContainer,
  flagCounterElement,
} from '../../dom-elements.js';
import { HEART_IMG, SMILEY_IMG, SMILEY_WIN_IMG, SMILEY_LOSE_IMG, SMILEY_MONOCLE_IMG } from '../../image-assets.js';

class AppRenderer {
  constructor(appState) {
    this.appState = appState;
  }

  render() {
    this.appState.board.renderBoard();
    this.renderFlagCounter();
    this.renderLives();
    this.renderTimer();
    this.renderSafeClickCount();
    this.renderHints();
    this.renderBestScore();
  }

  renderBestScore() {
    const { boardSqrt } = this.appState;
    const scoreKey = 'BestScoreLevel=' + boardSqrt;
    const previousBestScore = window.localStorage.getItem(scoreKey);
    if (previousBestScore === null) {
      bestScoreContainer.innerHTML = `<span>BEST SCORE: 00:00</span>`;
      return;
    }
    bestScoreContainer.innerHTML = `<span>BEST SCORE: ${previousBestScore}</span>`;
  }

  renderSafeClickCount() {
    const { safeClickCount } = this.appState;
    if (safeClickCount >= 0) {
      safeClickCountElement.innerHTML = `${safeClickCount}`;
    }
  }

  renderHints() {
    const { hintsCount } = this.appState;
    let hints = '';
    for (let i = 0; i < hintsCount; i++) {
      hints += `<button class="hint inset-border" data-idx="${i}">${SMILEY_MONOCLE_IMG}</button>`;
    }
    hintsContainerElement.innerHTML = hints;
  }

  renderTimer(time) {
    if (!time) {
      timerElement.innerHTML = '000';
      return;
    }
    const { minutes, seconds } = time;
    const formattedMinutes = minutes.toString();
    const formattedSeconds = seconds.toString().padStart(2, '0');
    timerElement.innerHTML = `${formattedMinutes}:${formattedSeconds}`;
  }

  renderFlagCounter() {
    const { flagCount } = this.appState;
    const paddingNum = flagCount >= 0 ? 3 : 0;
    const formmatedFlagCount = flagCount.toString().padStart(paddingNum, '0');
    flagCounterElement.innerHTML = `${formmatedFlagCount}`;
  }

  renderLives() {
    if (!this.isTimerRunning) {
      livesContainerElement.innerHTML = '';
      for (let i = 0; i < this.appState.lives; i++) livesContainerElement.innerHTML += `${HEART_IMG}`;
      return;
    }

    const children = livesContainerElement.children;
    [...children].reverse().forEach((child, idx) => {
      if (idx >= this.appState.lives) child.style.opacity = '0';
    });
  }

  renderSmileyLoss() {
    smileyContainerElement.innerHTML = SMILEY_WIN_IMG;
  }

  renderSmileyWin() {
    smileyContainerElement.innerHTML = SMILEY_WIN_IMG;
  }
}

export default AppRenderer;
