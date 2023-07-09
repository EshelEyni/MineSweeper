import {
  HEART_IMG,
  SMILEY_IMG,
  SMILEY_WIN_IMG,
  SMILEY_LOSE_IMG,
  SMILEY_MONOCLE_IMG,
  SMILEY_SHOCKED_IMG,
} from '../../image-assets.js';
import { isTestEnv } from '../../utils/utils';

class AppRenderer {
  constructor(appState) {
    this.appState = appState;
  }

  app({
    isUndoAction = false,
    safeClickCountElement,
    hintsContainerElement,
    boardTable,
    bestScoreContainer,
    livesContainerElement,
    flagCounterElement,
    timerElement,
  } = {}) {
    this.safeClickCount(safeClickCountElement);
    this.hints(hintsContainerElement);
    this.appState.board.render(boardTable);
    this.lives(livesContainerElement);
    this.flagCounter(flagCounterElement);
    if (isUndoAction) return;
    this.timer(timerElement);
    this.bestScore(bestScoreContainer);
  }

  safeClickCount(safeClickCountElement) {
    const { safeClickCount } = this.appState;
    if (safeClickCount >= 0) {
      safeClickCountElement.innerHTML = `${safeClickCount}`;
    }
  }

  hints(hintsContainerElement) {
    const { hintsCount } = this.appState;
    if (hintsCount <= 0) return;
    let hints = '';
    for (let i = 0; i < hintsCount; i++)
      hints += `<button class="hint inset-border" data-idx="${i}">${SMILEY_MONOCLE_IMG}</button>`;

    hintsContainerElement.innerHTML = hints;
  }

  hintBtnClicked(hintBtn) {
    hintBtn.style.backgroundColor = isTestEnv ? '#e9d66f' : 'var(--hint-color)';
  }

  bestScore(bestScoreContainer) {
    const { difficultyName } = this.appState;
    const previousBestScore = this.appState.storage.getBestScore(difficultyName);
    if (previousBestScore === null) {
      bestScoreContainer.innerHTML = `<span>BEST SCORE: 00:00</span>`;
      return;
    }
    const minutes = Math.floor(previousBestScore / 60);
    const seconds = previousBestScore % 60;
    const formattedSeconds = seconds.toString().padStart(2, '0');
    bestScoreContainer.innerHTML = `<span>BEST SCORE: ${minutes}:${formattedSeconds}</span>`;
  }

  lives(livesContainerElement) {
    if (!this.isTimerRunning) {
      let lives = '';
      for (let i = 0; i < this.appState.livesCount; i++) lives += `${HEART_IMG}`;
      livesContainerElement.innerHTML = lives;
      return;
    }

    const children = livesContainerElement.children;
    [...children].reverse().forEach((child, idx) => {
      if (idx >= this.appState.livesCount) child.style.opacity = '0';
    });
  }

  smileyDefault(smileyContainerElement) {
    smileyContainerElement.innerHTML = SMILEY_IMG;
  }

  smileyLoss(smileyContainerElement) {
    smileyContainerElement.innerHTML = SMILEY_LOSE_IMG;
  }

  smileyWin(smileyContainerElement) {
    smileyContainerElement.innerHTML = SMILEY_WIN_IMG;
  }

  smileyShocked(smileyContainerElement) {
    smileyContainerElement.innerHTML = SMILEY_SHOCKED_IMG;
  }

  toggleBtnActiveSetMinesManually(btnSetMinesManually) {
    btnSetMinesManually.classList.toggle('active');
  }

  flagCounter(flagCounterElement) {
    const { flagCount } = this.appState;
    const paddingNum = flagCount >= 0 ? 3 : 0;
    const formmatedFlagCount = flagCount.toString().padStart(paddingNum, '0');
    flagCounterElement.innerHTML = `${formmatedFlagCount}`;
  }

  timer(timerElement, time) {
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
