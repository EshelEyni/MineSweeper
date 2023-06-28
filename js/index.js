import App from './classes/app.js';
import { SMILEY_IMG, SMILEY_SHOCKED_IMG } from './constants.js';
import {
  smileyContainerElement,
  hintsContainerElement,
  gameBoardElement,
  btnClickSafe,
  btnDifficultyContainer,
  btnUndoAction,
  btnSetMinesManually,
  btnSetSevenBoom,
} from './dom-elements.js';

const app = new App();

smileyContainerElement.addEventListener('mousedown', () => (smileyContainerElement.innerHTML = SMILEY_SHOCKED_IMG));
smileyContainerElement.addEventListener('mouseup', () => (smileyContainerElement.innerHTML = SMILEY_IMG));
smileyContainerElement.addEventListener('click', app.handleSmileyClick.bind(app));

//  Cell click events
gameBoardElement.addEventListener('click', event => {
  const { target } = event;
  if (target.classList.contains('cell')) {
    if (!app.state.lives) return;
    const rowIdx = Number(target.dataset.rowIdx);
    const columnIdx = Number(target.dataset.columnIdx);
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
  const { target } = event;
  if (target.classList.contains('cell')) {
    if (!app.state.lives) return;
    const rowIdx = Number(target.dataset.rowIdx);
    const columnIdx = Number(target.dataset.columnIdx);
    const clickedCell = app.state.board.board[rowIdx][columnIdx];
    const isCellFlagged = clickedCell.handleCellRightClick();
    app.setFlagCounter(isCellFlagged);

    if (!app.isTimerRunning) app.handleGameStart();
    app.setStateHistory();
  }
});

//  Button click events
hintsContainerElement.addEventListener('click', event => {
  event.preventDefault();
  if (event.target.classList.contains('hint')) {
    event.target.style.backgroundColor = 'var(--hint-color)';
    app.toggleIsHintClick(event.target);
  }
});

btnClickSafe.addEventListener('click', app.handleBtnSafeClick.bind(app));

btnUndoAction.addEventListener('click', app.handleBtnUndoActionClick.bind(app));

btnDifficultyContainer.addEventListener('click', e => {
  const { difficultySettings } = e.target.dataset;
  const boundHandleClick = app.handleSetDifficultyBtnClick.bind(app);
  boundHandleClick(difficultySettings);
  smileyContainerElement.innerHTML = SMILEY_IMG;
});

btnSetMinesManually.addEventListener('click', app.handleBtnSetMinesManuallyClick.bind(app));
btnSetSevenBoom.addEventListener('click', app.handleBtnSetSevenBoomClick.bind(app));

//  Keyboard events
addEventListener('keydown', e => {
  if (e.key === 'e' && e.altKey && e.ctrlKey) {
    console.log('cheat mode activated');
    console.log(app.state.board);
    app.state.board.loopThroughCells(cell => {
      const cellElement = cell.getCellElement();
      cellElement.innerHTML = cell.getShownCellContent();
      const classListSet = new Set(cellElement.classList);
      if (classListSet.has('cheat')) cell.render();
      cellElement.classList.toggle('cheat');
    });
  }
});
