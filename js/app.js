'use strict';

// DOM Elements
const timerElement = document.querySelector('.timer');
const resultElement = document.querySelector('.gameover');
const safeClickCountElement = document.querySelector('.safe-click-count');
const smileyElement = document.querySelector('.smiley');
const livesElement = document.querySelector('.Lives');
const hintsContainerElement = document.querySelector('.hints-container');
const bestScoreElement = document.querySelector('.bestscore');
const gameBoardElement = document.querySelector('.board');

const btnClickSafe = document.querySelector('.btn-safe-click');
const btnDifficultyContainer = document.querySelector('.btn-difficulty-container');
const btnUndoAction = document.querySelector('.btn-undo-action');
const btnSetMinesManually = document.querySelector('.btn-set-mines-manually');
const btnSetSevenBoom = document.querySelector('.btn-set-seven-boom');

const app = new App();

smileyElement.addEventListener('click', app.handleSmileyClick.bind(app));

//  Cell click events
gameBoardElement.addEventListener('click', event => {
  if (!app.state.lives) return;
  const { target } = event;
  if (target.classList.contains('cell')) {
    const rowIdx = Number(target.dataset.rowIdx);
    const columnIdx = Number(target.dataset.columnIdx);
    // TODO: Extract this to a function in app

    const clickedCell = app.state.board.board[rowIdx][columnIdx];
    const { isManualMineSetting } = app;

    if (isManualMineSetting) {
      clickedCell.handleCellClick({ isManualMineSetting });
      app.state.minesCount--;
      if (!app.state.minesCount) app.isManualMineSetting = false;
      app.state.board.setSurroundingMineCount(rowIdx, columnIdx);
      app.setStateHistory();
      return;
    }

    if (!app.isTimerRunning) app.handleGameStart();

    if (app.isClickHint) {
      app.state.hintsCount--;
      app.state.board.handleHintCellClick(rowIdx, columnIdx);
      app.toggleIsHintClick();
      app.setStateHistory();
      return;
    }

    clickedCell.handleCellClick();
    clickedCell.render();

    if (clickedCell.isMine) {
      app.state.lives--;
      app.renderLives();
      if (!app.state.lives) {
        app.handleGameLoss();
      }
      app.setStateHistory();
      return;
    }

    app.state.board.revealSurroundingTargetCells(rowIdx, columnIdx);
    app.setStateHistory();
    app.checkGameVictory();
  }
});

// Cell right click events
gameBoardElement.addEventListener('contextmenu', event => {
  event.preventDefault();
  if (!app.state.lives) return;
  const { target } = event;
  if (target.classList.contains('cell')) {
    const rowIdx = Number(target.dataset.rowIdx);
    const columnIdx = Number(target.dataset.columnIdx);
    const clickedCell = app.state.board.board[rowIdx][columnIdx];
    clickedCell.handleCellRightClick();
    if (!app.isTimerRunning) app.handleGameStart();
    app.setStateHistory();
  }
});

//  Button click events
hintsContainerElement.addEventListener('click', event => {
  event.preventDefault();
  if (event.target.classList.contains('hint')) {
    event.target.style.backgroundColor = 'yellow';
    app.toggleIsHintClick(event.target);
  }
});

btnClickSafe.addEventListener('click', app.handleBtnSafeClick.bind(app));

btnUndoAction.addEventListener('click', app.handleBtnUndoActionClick.bind(app));

btnDifficultyContainer.addEventListener('click', e => {
  const { difficultySettings } = e.target.dataset;
  const boundHandleClick = app.handleSetDifficultyBtnClick.bind(app);
  boundHandleClick(difficultySettings);
  smileyElement.innerHTML = SMILEY_IMG;
});

btnSetMinesManually.addEventListener('click', app.handleBtnSetMinesManuallyClick.bind(app));
btnSetSevenBoom.addEventListener('click', app.handleBtnSetSevenBoomClick.bind(app));

//  Keyboard events
addEventListener('keydown', e => {
  if (e.key === 'e' && e.altKey && e.ctrlKey) {
    app.state.board.loopThroughCells(cell => {
      cell.isShown = !cell.isShown;
      cell.render();
    });
  }
});
