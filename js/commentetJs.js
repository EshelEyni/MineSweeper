// Booleans
// let isClickHint = false;
// let hintsNum = 3;
// let isTimerRunning = false;
// let intervalTimerId;
// let firstClickTimeStamp;
// let minesCount = 2;
// let boardSqrt = 4;
// let safeClickCount = 3;
// let isManualMineSetting = false;
// let isMinedSet = false;
// let stateSnapshot = [];

// let state = {
//   board: null,
//   lives: 1,
// };

// function buildBoard() {
//   stateSnapshot = [];

//   return Array(boardSqrt)
//     .fill()
//     .map(() =>
//       Array(boardSqrt)
//         .fill()
//         .map(() => new Cell())
//     );
// }

// Mines Setters

// function _setMines() {
//   let { board } = state;
//   while (minesCount > 0) {
//     const randomIdx = getRandomInt(0, boardSqrt);
//     if (board[randomIdx][randomIdx].isMine) continue;
//     board[randomIdx][randomIdx].isMine = true;
//     _setSurroundingMineCount(randomIdx, randomIdx);
//     minesCount--;
//   }
// }

// function _handleHintCellClick(targetRowIdx, targetColumnIdx) {
//   function _showHintedCells(hintedCells) {
//     const { board } = state;
//     hintedCells.forEach(cell => {
//       const { rowIdx, columnIdx } = cell;
//       if (board[rowIdx][columnIdx].isShown === false) {
//         board[rowIdx][columnIdx].isShown = true;
//         board[rowIdx][columnIdx].isHint = true;
//         renderCell(rowIdx, columnIdx);
//       }
//     });
//     return hintedCells;
//   }

//   function _hideHintedCells(hintedCells) {
//     const { board } = state;
//     setTimeout(() => {
//       hintedCells.forEach(cell => {
//         const { rowIdx, columnIdx } = cell;
//         if (board[rowIdx][columnIdx].isShown === true) {
//           board[rowIdx][columnIdx].isShown = false;
//           board[rowIdx][columnIdx].isHint = false;
//           renderCell(rowIdx, columnIdx);
//         }
//       });
//     }, 2500);
//   }

//   const hintedCells = _getSurroundingCells(targetRowIdx, targetColumnIdx);
//   _showHintedCells(hintedCells);
//   isClickHint = false;
//   hintsNum--;
//   _hideHintedCells(hintedCells);
// }

// Board Handlers

// function handleCellClick(elCell, i, j) {
//   stateSnapshot.push(JSON.stringify(state));
//   if (!isMinedSet && !isManualMineSetting) {
//     _setMines();
//     isMinedSet = true;
//   }
//   if (isManualMineSetting) {
//     state.board[i][j].isMine = true;
//     state.board[i][j].surroundingMinesCount = 0;
//     minesCount--;
//     if (minesCount === 0) {
//       isManualMineSetting = false;
//     }
//     _setSurroundingMineCount(i, j);
//     return;
//   }

//   if (state.board[i][j].isMarked) return;

//   if (isClickHint) {
//     _handleHintCellClick(i, j);
//     return;
//   }

//   state.board[i][j].isShown = true;
//   renderCell(i, j);
//   _revealSurroundingCells(i, j);

//   checkGameOver();

//   if (state.board[i][j].isMine) {
//     elCell.innerHTML = gMine;
//     state.lives--;
//     elCell.style.backgroundColor = 'red';
//     renderLives();
//     if (state.lives === 0) {
//       _handleGameLoss();
//     }
//   }

//   if (state.board[i][j].surroundingMinesCount && !state.board[i][j].isMine) {
//     elCell.innerHTML = state.board[i][j].surroundingMinesCount;
//   }

//   if (!isTimerRunning && !state.board[i][j].isMine) {
//     firstClickTimeStamp = new Date();
//     intervalTimerId = setInterval(renderTimer, 1);
//     isTimerRunning = true;
//   }
// }

// function _revealSurroundingCells(targetRowIdx, targetColumnIdx) {
//   const { board } = state;
//   if (board[targetRowIdx][targetColumnIdx].surroundingMinesCount) return;

//   const surroundingCells = _getSurroundingCells(targetRowIdx, targetColumnIdx, {
//     excludeTargetCell: true,
//   });

//   surroundingCells.forEach(cell => {
//     const { rowIdx, columnIdx } = cell;
//     const isRecurse =
//       board[rowIdx][columnIdx].isMine === false &&
//       board[rowIdx][columnIdx].surroundingMinesCount == 0 &&
//       board[rowIdx][columnIdx].isShown == false;

//     if (board[rowIdx][columnIdx].isMine === false) {
//       board[rowIdx][columnIdx].isShown = true;
//       renderCell(rowIdx, columnIdx);
//     }

//     if (isRecurse) _revealSurroundingCells(rowIdx, columnIdx);
//   });
// }

// function _getSurroundingCells(
//   targetRowIdx,
//   targetColumnIdx,
//   { excludeTargetCell = false } = {}
// ) {
//   const { board } = state;
//   const surroundingCells = [];
//   for (let rowIdx = targetRowIdx - 1; rowIdx <= targetRowIdx + 1; rowIdx++) {
//     if (rowIdx < 0 || rowIdx >= board.length) continue;
//     for (
//       let columnIdx = targetColumnIdx - 1;
//       columnIdx <= targetColumnIdx + 1;
//       columnIdx++
//     ) {
//       if (
//         excludeTargetCell &&
//         rowIdx === targetRowIdx &&
//         columnIdx === targetColumnIdx
//       )
//         continue;
//       if (columnIdx < 0 || columnIdx >= board[rowIdx].length) continue;
//       surroundingCells.push({ rowIdx, columnIdx });
//     }
//   }
//   return surroundingCells;
// }

// function handleCellRightClick(rowIdx, columnIdx) {
//   stateSnapshot.push(JSON.stringify(state));

//   if (!state.board[rowIdx][columnIdx].isMarked) {
//     state.board[rowIdx][columnIdx].isMarked = true;
//   } else {
//     state.board[rowIdx][columnIdx].isMarked = false;
//   }
//   renderCell(rowIdx, columnIdx);
//   checkGameOver();

//   if (!isTimerRunning) {
//     firstClickTimeStamp = new Date();
//     intervalTimerId = setInterval(renderTimer, 1);
//     isTimerRunning = true;
//   }
// }

// function handleBtnSetMinesManuallyClick() {
//     isManualMineSetting = true;
//   }

'use strict';

// const elTimer = document.querySelector('.timer');
// const gameOver = document.querySelector('.gameover');
// const elSafeClickCount = document.querySelector('.safe-click-count');
// const btnClickSafe = document.querySelector('.btn-safe-click');
// const elSmiley = document.querySelector('.smiley');
// const elLives = document.querySelector('.Lives');
// const hintsContainer = document.querySelector('.hints-container');
// const elBestScore = document.querySelector('.bestscore');
// const elBoard = document.querySelector('.board');
// const btnUndoAction = document.querySelector('.btn-undo-action');
// const btnDifficultyContainer = document.querySelector(
//   '.btn-difficulty-container'
// );

// const btnSetMinesManually = document.querySelector('.btn-set-mines-manually');
// const btnSetSevenBoom = document.querySelector('.btn-set-seven-boom');

// function render() {
//   renderBoard();
//   renderLives();
//   renderSafeClickCount();
//   renderHints();
// }

// function renderBoard() {
//   const { board } = state;
//   const rows = board
//     .map((row, rowIdx) => {
//       const cells = row
//         .map((_, columnIdx) => {
//           return `<td class="cell cell-${rowIdx}-${columnIdx}" data-row-idx="${rowIdx}" data-column-idx="${columnIdx}"></td>`;
//         })
//         .join('');

//       return `<tr>${cells}</tr>`;
//     })
//     .join('');

//   const strHTML = `<table><tbody>${rows}</tbody></table>`;

//   elBoard.innerHTML = strHTML;

//   board.forEach((row, rowIdx) => {
//     row.forEach((_, columnIdx) => {
//       renderCell(rowIdx, columnIdx, board);
//     });
//   });

//   renderBestScore();
// }

// function renderTimer() {
//   const currGameTime = new Date() - firstClickTimeStamp / 1000;
//   elTimer.innerHTML = `GAME TIME: ${Math.round(currGameTime, 1)}`;
// }

// function renderLives() {
//   elLives.innerHTML = `Number of lifes: `;
//   for (let i = 0; i < state.lives; i++) {
//     elLives.innerHTML += `${LIVE_IMG}`;
//   }
// }

// function renderSafeClickCount() {
//   if (safeClickCount >= 0) {
//     elSafeClickCount.innerHTML = `${safeClickCount}`;
//   }
// }

// function renderHints() {
//   for (let i = 0; i < hintsNum; i++) {
//     hintsContainer.innerHTML += `<button class="hint" data-idx="${i}">Hint</button>`;
//   }
// }

// function renderBestScore() {
//   let key = 'BestScoreLevel=' + boardSqrt;
//   let old = window.localStorage.getItem(key);
//   if (old === null) {
//     elBestScore.innerHTML = `BEST SCORE: 00:00`;
//     return;
//   }
//   elBestScore.innerHTML = `BEST SCORE: ${old}`;
// }

// function renderCell(rowIdx, columnIdx) {
//   const { board } = state;
//   let cell = board[rowIdx][columnIdx];
//   const elCell = document.querySelector(`.cell-${rowIdx}-${columnIdx}`);
//   if (cell.isShown) {
//     if (cell.isHint) {
//       elCell.style.backgroundColor = 'rgb(233, 214, 111)';
//     } else {
//       elCell.style.backgroundColor = 'rgb(187, 187, 187)';
//     }
//     if (board[rowIdx][columnIdx].surroundingMinesCount) {
//       elCell.innerHTML = board[rowIdx][columnIdx].surroundingMinesCount;
//     } else if (board[rowIdx][columnIdx].isMine) {
//       elCell.innerHTML = gMine;
//     } else {
//       elCell.innerHTML = '';
//     }
//   } else {
//     elCell.innerHTML = '';
//     if (cell.isSafeClick) {
//       elCell.style.backgroundColor = 'rgb(56, 148, 197)';
//     } else if (cell.isMarked) {
//       elCell.innerHTML = gFlag;
//     } else {
//       elCell.style.backgroundColor = 'gray';
//     }
//   }
// }
