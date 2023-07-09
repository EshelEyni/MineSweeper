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

smileyContainerElement.addEventListener('mousedown', () =>
  app.renderer.smileyShocked(smileyContainerElement)
);
smileyContainerElement.addEventListener('mouseup', () =>
  app.renderer.smileyDefault(smileyContainerElement)
);
smileyContainerElement.addEventListener('click', () =>
  app.handleSmileyClick({
    safeClickCountElement,
    hintsContainerElement,
    boardTable,
    bestScoreContainer,
    livesContainerElement,
    flagCounterElement,
    timerElement,
  })
);
boardTable.addEventListener('click', app.handleBoardClick.bind(app));
boardTable.addEventListener('contextmenu', app.handleBoardContainerRightClick.bind(app));
hintsContainerElement.addEventListener('click', app.handleHintContainerClick.bind(app));
btnClickSafe.addEventListener('click', () => app.handleBtnSafeClick(safeClickCountElement));
btnUndoAction.addEventListener('click', app.handleBtnUndoActionClick.bind(app));
btnDifficultyContainer.addEventListener('click', event =>
  app.handleSetDifficultyBtnClick(event, {
    smileyContainerElement,
    safeClickCountElement,
    hintsContainerElement,
    boardTable,
    bestScoreContainer,
    livesContainerElement,
    flagCounterElement,
    timerElement,
  })
);
btnSetMinesManually.addEventListener('click', () =>
  app.handleBtnSetMinesManuallyClick(btnSetMinesManually)
);
btnSetSevenBoom.addEventListener('click', () =>
  app.handleBtnSetSevenBoomClick({
    safeClickCountElement,
    hintsContainerElement,
    boardTable,
    bestScoreContainer,
    livesContainerElement,
    flagCounterElement,
    timerElement,
  })
);

addEventListener('keydown', e => {
  if (e.key === 'e' && e.altKey && e.ctrlKey)
    app.state.board.loopThroughCells(cell => cell.renderCheat());
});
