import { getRandomInt } from '../../utils/utils.js';
import AppState from './app-state';
import AppHistory from './app-history';
import AppRenderer from './app-renderer';
import { safeClickCountElement } from '../../dom-elements';

class App {
  constructor() {
    this.renderer.app();
  }

  handleSmileyClick() {
    this.#onResetGame(this.state.difficultyName);
  }

  handleBoardClick(event) {
    const { target } = event;
    if (!target.classList.contains('cell') || !this.state.lives) return;
    const rowIdx = Number(target.dataset.rowIdx);
    const columnIdx = Number(target.dataset.columnIdx);
    const clickedCell = this.state.board.board[rowIdx][columnIdx];
    if (clickedCell.isFlagged || clickedCell.isShown) return;

    const { isManualMineSetting, isTimerRunning, isClickHint } = this.state;
    if (isManualMineSetting) {
      this.#onManualMineSetting(clickedCell);
      return;
    }

    if (!isTimerRunning) this.#onGameStart();

    if (isClickHint) {
      this.#onClickHint(rowIdx, columnIdx);
      return;
    }

    clickedCell.onCellClick();
    clickedCell.render();

    if (clickedCell.isMine) {
      this.#onMineClick(rowIdx, columnIdx);
      return;
    }

    this.state.board.revealSurroundingTargetCells(rowIdx, columnIdx);
    this.history.addState(this.state);
    const isVicotry = this.state.verifyWin();
    if (isVicotry) this.renderer.smileyWin();
  }

  handleBoardContainerRightClick(event) {
    event.preventDefault();
    const { target } = event;
    if (!target.classList.contains('cell') || !this.state.lives) return;
    const rowIdx = Number(target.dataset.rowIdx);
    const columnIdx = Number(target.dataset.columnIdx);
    const clickedCell = this.state.board.board[rowIdx][columnIdx];
    const isCellFlagged = clickedCell.onCellRightClick();
    this.#setFlagCounter(isCellFlagged);
    if (!this.state.isTimerRunning) this.#onGameStart();
    this.history.addState(this.state);
  }

  handleHintContainerClick(event) {
    event.preventDefault();
    if (event.target.classList.contains('hint')) {
      event.target.style.backgroundColor = 'var(--hint-color)';
      this.state.toggleIsClickHint();
    }
  }

  handleBtnSafeClick() {
    if (!this.state.safeClickCount) return;
    if (!this.isMinesSet) this.state.board.setRandomMines(this.state.minesCount);
    this.state.decrementSafeClickCount();
    this.renderer.safeClickCount(safeClickCountElement);

    const safeCells = [];

    this.state.board.loopThroughCells(cell => {
      if (!cell.isMine && !cell.isShown) safeCells.push(cell);
    });
    if (!safeCells.length) return;

    const safeCell = safeCells[getRandomInt(0, safeCells.length - 1)];
    safeCell.render({ isSafeClick: true });

    setTimeout(() => {
      safeCell.render();
    }, 2000);
  }

  handleBtnUndoActionClick() {
    const prevState = this.history.getLastState();
    if (!prevState) return;
    this.state.setPrevState(prevState);
    this.renderer.app({ isUndoAction: true });
  }

  handleSetDifficultyBtnClick(event) {
    const { difficultyName } = event.target.dataset;
    this.#onResetGame(difficultyName);
    this.renderer.smileyDefault();
  }

  handleBtnSetMinesManuallyClick() {
    if (this.state.isMinesSet) return;
    this.renderer.toggleBtnActiveSetMinesManually();
    this.state.toggleIsManualMineSetting();
  }

  handleBtnSetSevenBoomClick() {
    clearInterval(this.intervalTimerId);
    this.state.toggleIsTimerRunning();
    this.state.board.setBoard();
    this.renderer.app();

    let index = 1;
    this.state.board.loopThroughCells(cell => {
      const digitSevenExists = () => {
        const separatedDigits = index.toString().split('');
        return separatedDigits.some(digit => digit === '7');
      };
      if (index % 7 === 0 || digitSevenExists()) cell.isMine = true;
      index++;
    });
  }

  #onResetGame(difficultyName) {
    clearInterval(this.state.intervalTimerId);
    this.state = new AppState(difficultyName);
    this.history = new AppHistory(this.state);
    this.renderer = new AppRenderer(this.state);
    this.renderer.app();
  }

  #onManualMineSetting(clickedCell) {
    if (clickedCell.isMine) return;
    const { isManualMineSetting } = this.state;
    clickedCell.onCellClick({ isManualMineSetting });
    this.state.decrementMinesCount();
    if (!this.state.minesCount) {
      this.state.toggleIsManualMineSetting();
      this.state.toggleIsMinesSet();
      this.renderer.toggleBtnActiveSetMinesManually();
    }
    const { rowIdx, columnIdx } = clickedCell.coords;
    this.state.board.setSurroundingMineCount(rowIdx, columnIdx);
    this.history.addState(this.state);
  }

  #onGameStart() {
    this.state.startGame();
    this.renderer.timer({ minutes: 0, seconds: 0 });
    this.state.intervalTimerId = setInterval(() => {
      const time = this.state.setTimer();
      this.renderer.timer(time);
    }, 1000);
  }

  #onClickHint(rowIdx, columnIdx) {
    this.state.board.handleHintCellClick(rowIdx, columnIdx);
    this.state.decrementHintsCount();
    this.state.toggleIsClickHint();
    this.history.addState(this.state);
  }

  #onMineClick() {
    this.state.decrementLives();
    this.renderer.lives();
    if (!this.state.lives) {
      this.state.onGameLoss();
      this.renderer.smileyLoss();
    }
    this.history.addState(this.state);
  }

  #setFlagCounter(isFlagged) {
    if (isFlagged) this.state.decrementFlagCount();
    else this.state.incrementFlagCount();
    this.renderer.flagCounter();
  }

  // Fields
  state = new AppState('medium');
  history = new AppHistory(this.state);
  renderer = new AppRenderer(this.state);
}

export default App;
