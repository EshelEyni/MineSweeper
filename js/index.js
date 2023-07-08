import 'core-js/stable';
import 'regenerator-runtime/runtime';
import App from './classes/app/app.js';
import {
  smileyContainerElement,
  hintsContainerElement,
  boardTable,
  btnClickSafe,
  btnDifficultyContainer,
  btnUndoAction,
  btnSetMinesManually,
  btnSetSevenBoom,
  livesContainerElement,
  safeClickCountElement,
  bestScoreContainer,
  flagCounterElement,
  timerElement,
} from './dom-elements.js';

const app = new App({
  safeClickCountElement,
  hintsContainerElement,
  boardTable,
  bestScoreContainer,
  livesContainerElement,
  flagCounterElement,
  timerElement,
});

smileyContainerElement.addEventListener('mousedown', app.renderer.smileyShocked);
smileyContainerElement.addEventListener('mouseup', app.renderer.smileyDefault);
smileyContainerElement.addEventListener('click', app.handleSmileyClick.bind(app));
boardTable.addEventListener('click', app.handleBoardClick.bind(app));
boardTable.addEventListener('contextmenu', app.handleBoardContainerRightClick.bind(app));
hintsContainerElement.addEventListener('click', app.handleHintContainerClick.bind(app));
btnClickSafe.addEventListener('click', () => app.handleBtnSafeClick(safeClickCountElement));
btnUndoAction.addEventListener('click', app.handleBtnUndoActionClick.bind(app));
btnDifficultyContainer.addEventListener('click', () =>
  app.handleSetDifficultyBtnClick(smileyContainerElement)
);
btnSetMinesManually.addEventListener('click', () =>
  app.handleBtnSetMinesManuallyClick(btnSetMinesManually)
);
btnSetSevenBoom.addEventListener('click', app.handleBtnSetSevenBoomClick.bind(app));

addEventListener('keydown', e => {
  if (e.key === 'e' && e.altKey && e.ctrlKey)
    app.state.board.loopThroughCells(cell => cell.renderCheat());
});
