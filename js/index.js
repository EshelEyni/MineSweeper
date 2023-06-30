import 'core-js/stable';
import 'regenerator-runtime/runtime';
import App from './classes/app/app.js';
import { SMILEY_IMG, SMILEY_SHOCKED_IMG } from './image-assets.js';
import {
  smileyContainerElement,
  hintsContainerElement,
  boardTable,
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

boardTable.addEventListener('click', app.handleBoardClick.bind(app));
boardTable.addEventListener('contextmenu', app.handleBoardContainerRightClick.bind(app));

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
    app.state.board.loopThroughCells(cell => {
      const cellElement = cell.getCellElement();
      cellElement.innerHTML = cell.getShownCellContent();
      const classListSet = new Set(cellElement.classList);
      if (classListSet.has('cheat')) cell.render();
      cellElement.classList.toggle('cheat');
    });
  }
});
