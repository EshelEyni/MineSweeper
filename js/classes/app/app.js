import { getRandomInt } from '../../utils.js';
import AppState from './app-state';
import AppHistory from './app-history';
import AppRenderer from './app-renderer';

class App {
  constructor() {
    this.renderer.render();
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
      this.#onManualMineSetting();
      return;
    }

    if (!isTimerRunning) this.#onGameStart();

    if (isClickHint) {
      this.#onClickHint();
      return;
    }

    clickedCell.onCellClick();
    clickedCell.render();

    if (clickedCell.isMine) {
      this.#onMineClick();
      return;
    }

    this.state.board.revealSurroundingTargetCells(rowIdx, columnIdx);
    this.history.addState(this.state);
    const isVicotry = this.state.verifyGameVictory();
    if (isVicotry) this.renderer.renderSmileyWin();
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

  #onGameStart() {
    this.state.startGame();
    this.renderer.renderTimer({ minutes: 0, seconds: 0 });
    this.state.intervalTimerId = setInterval(() => {
      const time = this.state.setTimer();
      this.renderer.renderTimer(time);
    }, 1000);
  }

  #setFlagCounter(isFlagged) {
    if (isFlagged) this.state.decrementFlagCount();
    else this.state.incrementFlagCount();
    this.renderer.renderFlagCounter();
  }

  handleBtnSetMinesManuallyClick() {
    this.state.toggleIsManualMineSetting();
  }

  handleBtnSetSevenBoomClick() {
    clearInterval(this.intervalTimerId);
    this.isTimerRunning = false;
    this.state.board.setBoard();
    this.renderer.render();

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

  handleSetDifficultyBtnClick(difficultySetting) {
    this.state = new AppState(difficultySetting);
    this.prevAppState = new AppState(difficultySetting);
    this.stateHistory = [];
    const { intervalTimerId } = this.state;
    clearInterval(intervalTimerId);
    this.renderer.render();
  }

  handleSmileyClick() {
    this.state = new AppState(this.state.difficultyName);
    this.prevAppState = new AppState(this.state.difficultyName);
    this.stateHistory = [];
    const { intervalTimerId } = this.state;
    clearInterval(intervalTimerId);
    this.renderer.render();
  }

  handleBtnSafeClick() {
    if (!this.state.safeClickCount) return;
    if (!this.isMinesSet) this.state.board.setMines(this.state.minesCount);
    this.state.decrementSafeClickCount();
    this.renderer.renderSafeClickCount();

    const safeCells = [];

    this.state.board.loopThroughCells(cell => {
      if (!cell.isMine && !cell.isShown) safeCells.push(cell);
    });
    if (!safeCells.length) return;

    const safeCell = safeCells[getRandomInt(0, safeCells.length - 1)];
    safeCell.isSafeClick = true;
    safeCell.render({ isSafeClick: true });

    setTimeout(() => {
      safeCell.isSafeClick = false;
      safeCell.render();
    }, 2000);
  }

  handleBtnUndoActionClick() {
    const lastStateSnapshot = this.history.getState();
    if (!lastStateSnapshot) return;
    this.state.setState(lastStateSnapshot);
    this.state.board.renderBoard();
    this.renderer.renderFlagCounter();
    this.renderer.renderLives();
    this.renderer.renderSafeClickCount();
    this.renderer.renderHints();
  }

  #onManualMineSetting() {
    clickedCell.onCellClick({ isManualMineSetting });
    this.state.decrementMinesCount();
    if (!this.state.minesCount) this.state.toggleIsManualMineSetting();
    this.state.board.setSurroundingMineCount(rowIdx, columnIdx);
    this.history.addState(this.state);
  }

  #onClickHint() {
    this.state.board.handleHintCellClick(rowIdx, columnIdx);
    this.state.decrementHintsCount();
    this.state.toggleIsClickHint();
    this.history.addState(this.state);
  }

  #onMineClick() {
    this.state.decrementLives();
    this.renderer.renderLives();
    if (!this.state.lives) {
      this.state.onGameLoss();
      this.renderer.renderSmileyLoss();
    }
    this.history.addState(this.state);
  }

  // Fields
  state = new AppState('medium');
  history = new AppHistory(this.state);
  renderer = new AppRenderer(this.state);
}

export default App;
