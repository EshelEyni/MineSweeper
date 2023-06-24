// elSmiley.addEventListener('click', handleSmileyClick);

// // Cell click events
// elBoard.addEventListener('click', event => {
//   const { target } = event;
//   if (target.classList.contains('cell')) {
//     const rowIdx = Number(target.dataset.rowIdx);
//     const columnIdx = Number(target.dataset.columnIdx);
//     handleCellClick(target, rowIdx, columnIdx);
//   }
// });

// // Cell right click events
// elBoard.addEventListener('contextmenu', event => {
//   event.preventDefault();
//   const { target } = event;
//   if (target.classList.contains('cell')) {
//     const rowIdx = Number(target.dataset.rowIdx);
//     const columnIdx = Number(target.dataset.columnIdx);
//     handleCellRightClick(rowIdx, columnIdx);
//   }
// });

// // Button click events
// hintsContainer.addEventListener('click', event => {
//   event.preventDefault();
//   if (event.target.classList.contains('hint')) {
//     const idx = event.target.dataset.idx;
//     handleBtnHintClick(event.target, idx);
//   }
// });

// btnClickSafe.addEventListener('click', handleBtnSafeClick);
// btnUndoAction.addEventListener('click', handleBtnUndoActionClick);
// btnDifficultyContainer.addEventListener('click', e => {
//   const [boardSqrt, numOfMines, numsOfLives] =
//     e.target.dataset.difficultySettings.split(',').map(Number);
//   handleSetDifficultyBtnClick(boardSqrt, numOfMines, numsOfLives);
// });

// btnSetMinesManually.addEventListener('click', handleBtnSetMinesManuallyClick);
// btnSetSevenBoom.addEventListener('click', handleBtnSetSevenBoomClick);
