// Get DOM elements for different parts of the game UI
// The 'document.querySelector' function is used to select an element from the DOM using CSS selectors
const timerElement = document.querySelector('.timer');
const safeClickCountElement = document.querySelector('.safe-click-count');
const smileyContainerElement = document.querySelector('.smiley-container');
const livesContainerElement = document.querySelector('.lives-container');
const hintsContainerElement = document.querySelector('.hints-container');
const bestScoreElement = document.querySelector('.best-score');
const gameBoardElement = document.querySelector('.board-container');
const flagCounterElement = document.querySelector('.flag-counter');
const btnClickSafe = document.querySelector('.btn-safe-click');
const btnDifficultyContainer = document.querySelector('.btn-difficulty-container');
const btnUndoAction = document.querySelector('.btn-undo-action');
const btnSetMinesManually = document.querySelector('.btn-set-mines-manually');
const btnSetSevenBoom = document.querySelector('.btn-set-seven-boom');

export {
  timerElement,
  safeClickCountElement,
  smileyContainerElement,
  livesContainerElement,
  hintsContainerElement,
  bestScoreElement,
  gameBoardElement,
  flagCounterElement,
  btnClickSafe,
  btnDifficultyContainer,
  btnUndoAction,
  btnSetMinesManually,
  btnSetSevenBoom,
};
