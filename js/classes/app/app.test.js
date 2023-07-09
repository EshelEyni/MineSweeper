import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './app';
import AppState from './app-state';
import AppHistory from './app-history';
import AppRenderer from './app-renderer';
import Board from '../board/board';
import Cell from '../cell/cell';
import { jsdom } from '../../test-dom';

function expectMethodsNotToBeCalled(methods) {
  methods.forEach(method => {
    expect(method).not.toHaveBeenCalled();
  });
}

function expectMethodsToBeCalled(methods) {
  methods.forEach(method => {
    expect(method).toHaveBeenCalled();
  });
}

function setMockMethodsOnPrototype(prototype, methods) {
  methods.forEach(method => {
    prototype[method] = vi.fn();
  });
}

describe('App', () => {
  let app;
  let safeClickCountElement,
    hintsContainerElement,
    boardTable,
    bestScoreContainer,
    livesContainerElement,
    flagCounterElement,
    timerElement,
    smileyContainerElement,
    btnSetSevenBoom,
    btnSetMinesManually,
    btnUndoAction,
    btnDifficultyContainer,
    btnClickSafe;

  let loopThroughCellsOriginalMethod = Board.prototype.loopThroughCells;

  beforeEach(() => {
    global.window = jsdom.window;
    global.document = jsdom.window.document;
    global.localStorage = window.localStorage;

    setMockMethodsOnPrototype(AppState.prototype, [
      'decrementMinesCount',
      'toggleIsManualMineSetting',
      'toggleIsMinesSet',
      'toggleIsClickHint',
      'decrementLives',
      'startGame',
      'onGameLoss',
      'verifyWin',
      'decrementHintsCount',
      'incrementFlagCount',
      'decrementFlagCount',
      'setTimer',
      'decrementSafeClickCount',
      'setPrevState',
      'toggleIsTimerRunning',
    ]);

    setMockMethodsOnPrototype(AppRenderer.prototype, [
      'app',
      'smileyWin',
      'smileyLoss',
      'toggleBtnActiveSetMinesManually',
      'lives',
      'timer',
      'flagCounter',
      'hintBtnClicked',
      'safeClickCount',
    ]);

    setMockMethodsOnPrototype(AppHistory.prototype, ['addState']);

    setMockMethodsOnPrototype(Board.prototype, [
      'setSurroundingMineCount',
      'revealSurroundingTargetCells',
      'handleHintCellClick',
      'setRandomMines',
      'loopThroughCells',
    ]);

    setMockMethodsOnPrototype(Cell.prototype, ['onCellClick', 'onCellRightClick', 'render']);

    timerElement = document.querySelector('.timer');
    safeClickCountElement = document.querySelector('.safe-click-count');
    livesContainerElement = document.querySelector('.lives-container');
    hintsContainerElement = document.querySelector('.hints-container');
    bestScoreContainer = document.querySelector('.best-score-container');
    boardTable = document.querySelector('.board');
    flagCounterElement = document.querySelector('.flag-counter');
    btnClickSafe = document.querySelector('.btn-safe-click');
    btnDifficultyContainer = document.querySelector('.btn-difficulty-container');
    btnUndoAction = document.querySelector('.btn-undo-action');
    btnSetMinesManually = document.querySelector('.btn-set-mines-manually');
    btnSetSevenBoom = document.querySelector('.btn-set-seven-boom');
    smileyContainerElement = document.querySelector('.smiley-container');
  });

  afterEach(() => {
    clearInterval(app.state.intervalTimerId);
  });

  describe('constructor', () => {
    beforeEach(() => {
      app = new App({
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement,
      });
    });

    it('should create an instance of App with proper properties', () => {
      expect(app).toBeInstanceOf(App);
    });

    it('should initialize instances of AppState, AppHistory, and AppRenderer in App constructor', () => {
      expect(app.state).toBeInstanceOf(AppState);
      expect(app.history).toBeInstanceOf(AppHistory);
      expect(app.renderer).toBeInstanceOf(AppRenderer);
    });

    it('should render the app', () => {
      expect(app.renderer.app).toHaveBeenCalled();
    });
  });

  describe('handleSmileyClick', () => {
    beforeEach(() => {
      app = new App({
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement,
      });
    });

    it('should trigger #onResetGame when smiley is clicked', () => {
      const prevDifficultyName = 'easy';
      const defaultState = new AppState(prevDifficultyName);
      const defaultHistory = new AppHistory(defaultState);
      const defaultRenderer = new AppRenderer(defaultState);
      app.state.difficultyName = prevDifficultyName;
      app.state.intervalTimerId = 1;
      app.handleSmileyClick(
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement
      );

      expect(app.state.intervalTimerId).toBeUndefined();
      expect(app.state).toEqual(defaultState);
      expect(app.state.difficultyName).toBe(prevDifficultyName);
      expect(app.history).toEqual(defaultHistory);
      expect(app.renderer).toEqual(defaultRenderer);
      expect(app.renderer.app).toHaveBeenCalled();
    });
  });

  describe('Board Clicks', () => {
    let event, cellElement, rowIdx, columnIdx;

    const setMockCell = () => {
      rowIdx = 0;
      columnIdx = 0;
      cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.dataset.rowIdx = String(rowIdx);
      cellElement.dataset.columnIdx = String(columnIdx);
      event = { target: cellElement };
      Object.prototype.preventDefault = vi.fn();
    };

    describe('handleBoardClick', () => {
      const setMethodsToCheckForEarlyReturn = app => {
        const methodsToCheckForEarlyReturn = [
          app.state.decrementMinesCount,
          app.state.toggleIsManualMineSetting,
          app.state.toggleIsMinesSet,
          app.state.toggleIsClickHint,
          app.state.decrementLives,
          app.state.startGame,
          app.state.onGameLoss,
          app.state.verifyWin,
          app.state.decrementHintsCount,
          app.renderer.smileyWin,
          app.renderer.smileyLoss,
          app.renderer.toggleBtnActiveSetMinesManually,
          app.renderer.lives,
          app.renderer.timer,
          app.history.addState,
          app.state.board.setSurroundingMineCount,
          app.state.board.revealSurroundingTargetCells,
          app.state.board.handleHintCellClick,
          app.state.board.board[rowIdx][columnIdx].onCellClick,
          app.state.board.board[rowIdx][columnIdx].render,
        ];

        return methodsToCheckForEarlyReturn;
      };

      beforeEach(() => {
        app = new App({
          safeClickCountElement,
          hintsContainerElement,
          boardTable,
          bestScoreContainer,
          livesContainerElement,
          flagCounterElement,
          timerElement,
        });

        setMockCell();
      });

      afterEach(() => {
        clearInterval(app.state.intervalTimerId);
      });

      it('should exit handleBoardClick without triggering methods if target lacks cell class', () => {
        cellElement.classList.remove('cell');
        app.handleBoardClick(event);
        const methodsToCheckForEarlyReturn = setMethodsToCheckForEarlyReturn(app);
        expectMethodsNotToBeCalled(methodsToCheckForEarlyReturn);
      });

      it('should exit handleBoardClick without triggering methods if state.live are falsey', () => {
        app.state.livesCount = 0;
        app.handleBoardClick(event);
        const methodsToCheckForEarlyReturn = setMethodsToCheckForEarlyReturn(app);
        expectMethodsNotToBeCalled(methodsToCheckForEarlyReturn);
      });

      it('should exit handleBoardClick without triggering methods if target lacks rowIdx and columnIdx data attributes', () => {
        cellElement.removeAttribute('data-row-idx');
        cellElement.removeAttribute('data-column-idx');
        app.handleBoardClick(event);
        const methodsToCheckForEarlyReturn = setMethodsToCheckForEarlyReturn(app);
        expectMethodsNotToBeCalled(methodsToCheckForEarlyReturn);
      });

      it('should exit handleBoardClick without triggering methods if the clickedCell is flagged', () => {
        app.state.board.board[rowIdx][columnIdx].isFlagged = true;
        app.handleBoardClick(event);
        const methodsToCheckForEarlyReturn = setMethodsToCheckForEarlyReturn(app);
        expectMethodsNotToBeCalled(methodsToCheckForEarlyReturn);
      });

      it('should exit handleBoardClick without triggering methods if the clickedCell is aleady shown', () => {
        app.state.board.board[rowIdx][columnIdx].isShown = true;
        app.handleBoardClick(event);
        const methodsToCheckForEarlyReturn = setMethodsToCheckForEarlyReturn(app);
        expectMethodsNotToBeCalled(methodsToCheckForEarlyReturn);
      });

      it('should trigger methods in #onManualMineSetting if the isManualMineSetting is a true', () => {
        app.state.isManualMineSetting = true;

        const methodToBeCalled = [
          app.state.decrementMinesCount,
          app.state.board.setSurroundingMineCount,
          app.history.addState,
          app.state.board.board[rowIdx][columnIdx].onCellClick,
        ];
        
        const methodsNotCalledWhenMinesCountPositive = [
          app.state.toggleIsManualMineSetting,
          app.state.toggleIsMinesSet,
          app.renderer.toggleBtnActiveSetMinesManually,
          app.state.board.loopThroughCells
        ];
        
        const methodsNeverCalled = [
          app.state.toggleIsClickHint,
          app.state.decrementLives,
          app.state.startGame,
          app.state.onGameLoss,
          app.state.verifyWin,
          app.state.decrementHintsCount,
          app.renderer.smileyWin,
          app.renderer.smileyLoss,
          app.renderer.lives,
          app.renderer.timer,
          app.state.board.revealSurroundingTargetCells,
          app.state.board.handleHintCellClick,
          app.state.board.board[rowIdx][columnIdx].render,
        ];

        app.handleBoardClick(event);
        expectMethodsToBeCalled(methodToBeCalled);
        expectMethodsNotToBeCalled([
          ...methodsNeverCalled,
          ...methodsNotCalledWhenMinesCountPositive,
        ]);

        app.state.minesCount = 0;

        app.handleBoardClick(event);

        expectMethodsToBeCalled([...methodToBeCalled, ...methodsNotCalledWhenMinesCountPositive]);
        expectMethodsNotToBeCalled(methodsNeverCalled);
      });

      it('should trigger #onGameStart if the isManualMineSetting and isTimerRunning is falsey', () => {
        app.handleBoardClick(event);
        const methodToBeCalled = [app.state.startGame, app.renderer.timer];
        expectMethodsToBeCalled(methodToBeCalled);
        expect(app.state.intervalTimerId).toBeTruthy();
      });

      it('should not trigger #onGameStart if isTimerRunning is true', () => {
        app.state.isTimerRunning = true;
        app.state.intervalTimerId = 1;
        app.handleBoardClick(event);
        expect(app.state.startGame).not.toHaveBeenCalled();
        expect(app.state.intervalTimerId).toBeTruthy();
      });

      it('should not start game if isManualMineSetting is true', () => {
        app.state.isManualMineSetting = true;
        app.handleBoardClick(event);
        expect(app.state.startGame).not.toHaveBeenCalled();
        expect(app.state.intervalTimerId).toBeFalsy();
      });

      it('should trigger methods in #onClickHint if the isClickHint is true', () => {
        app.state.isClickHint = true;
        const methodToBeCalled = [
          app.state.board.handleHintCellClick,
          app.state.decrementHintsCount,
          app.state.toggleIsClickHint,
          app.history.addState,
        ];

        const methodsNotToBeCalled = [
          app.state.decrementLives,
          app.state.onGameLoss,
          app.state.verifyWin,
          app.renderer.smileyWin,
          app.renderer.smileyLoss,
          app.renderer.lives,
          app.state.board.setSurroundingMineCount,
        ];

        app.handleBoardClick(event);
        expectMethodsToBeCalled(methodToBeCalled);
        expectMethodsNotToBeCalled(methodsNotToBeCalled);
      });

      it('should not trigger methods in #onClickHint if the isClickHint is falsey', () => {
        app.state.isClickHint = false;
        const methodsNotToBeCalled = [
          app.state.board.handleHintCellClick,
          app.state.decrementHintsCount,
          app.state.toggleIsClickHint,
        ];
        app.handleBoardClick(event);
        expectMethodsNotToBeCalled(methodsNotToBeCalled);
      });

      it('should trigger onCellClick and render in default state', () => {
        const methodToBeCalled = [
          app.state.board.board[rowIdx][columnIdx].onCellClick,
          app.state.board.board[rowIdx][columnIdx].render,
        ];
        app.handleBoardClick(event);
        expectMethodsToBeCalled(methodToBeCalled);
      });

      it('should trigger methods in onMineClick if the clickedCell is a mine', () => {
        app.state.board.board[rowIdx][columnIdx].isMine = true;
        const methodToBeCalled = [
          app.state.decrementLives,
          app.renderer.lives,
          app.history.addState,
        ];
        app.handleBoardClick(event);
        expectMethodsToBeCalled(methodToBeCalled);
      });

      it('should trigger methods in onGameLoss if the clickedCell is a mine and lives is 0', () => {
        app.state.livesCount = 1;
        app.state.board.board[rowIdx][columnIdx].isMine = true;
        app.state.decrementLives = vi.fn(() => app.state.livesCount--);
        const methodToBeCalled = [
          app.state.decrementLives,
          app.renderer.lives,
          app.state.onGameLoss,
          app.renderer.smileyLoss,
        ];
        app.handleBoardClick(event);
        expectMethodsToBeCalled(methodToBeCalled);
      });

      it('should trigger methods revealSurroundingTargetCells, addState, verifyWin if the clickedCell is not a mine and isShown is falsey', () => {
        const methodToBeCalled = [
          app.state.board.revealSurroundingTargetCells,
          app.history.addState,
        ];
        app.handleBoardClick(event);
        expectMethodsToBeCalled(methodToBeCalled);
      });

      it('should trigger smileyWin if verifyWin returns true', () => {
        app.state.verifyWin = vi.fn(() => true);
        app.handleBoardClick(event);
        expect(app.renderer.smileyWin).toHaveBeenCalled();
      });
    });

    describe('handleBoardContainerRightClick', () => {
      const setMethodsToCheckForEarlyReturn = app => {
        return [
          app.state.decrementFlagCount,
          app.state.incrementFlagCount,
          app.state.startGame,
          app.renderer.flagCounter,
          app.renderer.timer,
          app.history.addState,
        ];
      };
      beforeEach(() => {
        app = new App({
          safeClickCountElement,
          hintsContainerElement,
          boardTable,
          bestScoreContainer,
          livesContainerElement,
          flagCounterElement,
          timerElement,
        });

        Cell.prototype.onCellRightClick = vi.fn(() => false);

        setMockCell();
      });

      afterEach(() => {
        clearInterval(app.state.intervalTimerId);
      });

      it('should exit handleBoardClick without triggering methods if target lacks cell class', () => {
        cellElement.classList.remove('cell');
        app.handleBoardClick(event);
        const methodsToCheckForEarlyReturn = setMethodsToCheckForEarlyReturn(app);
        expectMethodsNotToBeCalled(methodsToCheckForEarlyReturn);
      });

      it('should exit handleBoardClick without triggering methods if state.live are falsey', () => {
        app.state.livesCount = 0;
        app.handleBoardClick(event);
        const methodsToCheckForEarlyReturn = setMethodsToCheckForEarlyReturn(app);
        expectMethodsNotToBeCalled(methodsToCheckForEarlyReturn);
      });

      it('should exit handleBoardClick without triggering methods if target lacks rowIdx and columnIdx data attributes', () => {
        cellElement.removeAttribute('data-row-idx');
        cellElement.removeAttribute('data-column-idx');
        app.handleBoardClick(event);
        const methodsToCheckForEarlyReturn = setMethodsToCheckForEarlyReturn(app);
        expectMethodsNotToBeCalled(methodsToCheckForEarlyReturn);
      });

      it('should trigger onCellRightClick', () => {
        const { onCellRightClick } = app.state.board.board[rowIdx][columnIdx];
        app.handleBoardContainerRightClick(event);
        expect(onCellRightClick).toHaveBeenCalled();
      });

      it('should trigger methods in #setFlagCounter when isCellFlagged is false', () => {
        const methodToBeCalled = [app.state.incrementFlagCount, app.renderer.flagCounter];
        app.handleBoardContainerRightClick(event);
        expectMethodsToBeCalled(methodToBeCalled);
      });

      it('should trigger methods in #setFlagCounter when isCellFlagged is true', () => {
        Cell.prototype.onCellRightClick = vi.fn(() => true);
        const methodToBeCalled = [app.state.decrementFlagCount, app.renderer.flagCounter];
        app.handleBoardContainerRightClick(event);
        expectMethodsToBeCalled(methodToBeCalled);
      });

      it('should trigger #onGameStart if the isManualMineSetting and isTimerRunning is falsey', () => {
        app.handleBoardContainerRightClick(event);
        const methodToBeCalled = [app.state.startGame, app.renderer.timer];
        expectMethodsToBeCalled(methodToBeCalled);
        expect(app.state.intervalTimerId).toBeTruthy();
      });

      it('should not trigger #onGameStart if isTimerRunning is true', () => {
        app.state.isTimerRunning = true;
        app.state.intervalTimerId = 1;
        app.handleBoardContainerRightClick(event);
        expect(app.state.startGame).not.toHaveBeenCalled();
        expect(app.state.intervalTimerId).toBeTruthy();
      });
    });
  });

  describe('handleHintContainerClick', () => {
    let event, btnElement, methods;

    beforeEach(() => {
      btnElement = document.createElement('button');
      btnElement.classList.add('hint');
      event = { target: btnElement };
      app = new App({
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement,
      });
      methods = [app.renderer.hintBtnClicked, app.state.toggleIsClickHint];
    });

    it('should not trigger methods if target does not contain hint class', () => {
      btnElement.classList.remove('hint');
      app.handleHintContainerClick(event);
      expectMethodsNotToBeCalled(methods);
    });

    it('should trigger methods if target contains hint class', () => {
      app.handleHintContainerClick(event);
      expectMethodsToBeCalled(methods);
    });
  });

  describe('handleSafeClickContainerClick', () => {
    let methods, allCellRenderMethods;

    beforeEach(() => {
      app = new App({
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement,
      });

      allCellRenderMethods = app.state.board.board.map(row => row.map(cell => cell.render)).flat(1);
      methods = [
        app.state.board.setRandomMines,
        app.state.board.loopThroughCells,
        app.state.decrementSafeClickCount,
        app.renderer.safeClickCount,
      ];
    });

    it('should not trigger methods in handleBtnSafeClick when safeClickCount is 0', () => {
      app.state.safeClickCount = 0;
      app.handleBtnSafeClick(safeClickCountElement);
      expectMethodsNotToBeCalled([...methods, ...allCellRenderMethods]);
    });

    it('should not trigger setRandomMines method in handleBtnSafeClick when state.isMineSet is true', () => {
      app.state.isMinesSet = true;
      app.handleBtnSafeClick(safeClickCountElement);
      expect(app.state.board.setRandomMines).not.toHaveBeenCalled();
    });

    it('should trigger methods in handleBtnSafeClick when safeClickCount is greater than 0', () => {
      app.handleBtnSafeClick(safeClickCountElement);
      expectMethodsToBeCalled(methods);

      // TODO: find a way to test the render method
    });
  });

  describe('handleBtnUndoActionClick', () => {
    beforeEach(() => {
      app = new App({
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement,
      });
    });

    it('should not trigger methods in handleBtnUndoActionClick when history.getLastState is falsey', () => {
      AppHistory.prototype.getLastState = vi.fn(() => false);
      app.handleBtnUndoActionClick();
      expect(app.state.setPrevState).not.toHaveBeenCalled();
      expect(app.renderer.app).toHaveBeenCalledOnce();
    });

    it('should trigger methods in handleBtnUndoActionClick when history.getLastState is truthy', () => {
      AppHistory.prototype.getLastState = vi.fn(() => true);
      app.handleBtnUndoActionClick();
      expect(app.state.setPrevState).toHaveBeenCalled();
      expect(app.renderer.app).toHaveBeenCalledTimes(2);
    });
  });

  describe('handleSetDifficultyBtnClick', () => {
    let event, btnElement;

    beforeEach(() => {
      btnElement = document.createElement('button');
      btnElement.dataset.difficultyName = 'easy';
      event = { target: btnElement };
      app = new App({
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement,
      });
    });

    it('should trigger #onResetGame when Difficulty Button clicked', () => {
      app.handleSetDifficultyBtnClick(event, {
        smileyContainerElement,
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement,
        smileyContainerElement,
      });
      expect(app.state.intervalTimerId).toBeUndefined();
      expect(app.state.difficultyName).toBe('easy');

      btnElement.dataset.difficultyName = 'hard';
      app.handleSetDifficultyBtnClick(event, {
        smileyContainerElement,
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement,
        smileyContainerElement,
      });
      expect(app.state.intervalTimerId).toBeUndefined();
      expect(app.state.difficultyName).toBe('hard');
    });
  });

  describe('handleBtnSetMinesManuallyClick', () => {
    let methods;
    beforeEach(() => {
      app = new App({
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement,
      });
      methods = [app.renderer.toggleBtnActiveSetMinesManually, app.state.toggleIsManualMineSetting];
    });

    it('should trigger methods when button clicked', () => {
      app.handleBtnSetMinesManuallyClick();
      expectMethodsToBeCalled(methods);
    });

    it('should not trigger methods when button clicked if state.isMineSet is true', () => {
      app.state.isMinesSet = true;
      app.handleBtnSetMinesManuallyClick();
      expectMethodsNotToBeCalled(methods);
    });

    it('should not trigger methods when button clicked if state.isManualMineSetting is true', () => {
      app.state.isManualMineSetting = true;
      app.handleBtnSetMinesManuallyClick();
      expectMethodsNotToBeCalled(methods);
    });
  });

  describe('handleBtnSetSevenBoomClick', () => {
    let methodsExpectToBeCalledOnce;
    beforeEach(() => {
      app = new App({
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement,
      });
      methodsExpectToBeCalledOnce = [
        app.state.toggleIsTimerRunning,
        app.state.board.loopThroughCells,
      ];
    });

    it('should trigger methods when button clicked', () => {
      app.handleBtnSetSevenBoomClick({
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement,
      });
      expectMethodsToBeCalled(methodsExpectToBeCalledOnce);
      expect(app.renderer.app).toHaveBeenCalledTimes(2);
    });

    it('should set mine at every cell that is a multiple of 7 or that every cell that is number contain the digit 7', () => {
      app.handleBtnSetSevenBoomClick({
        safeClickCountElement,
        hintsContainerElement,
        boardTable,
        bestScoreContainer,
        livesContainerElement,
        flagCounterElement,
        timerElement,
      });

      Board.prototype.loopThroughCells = loopThroughCellsOriginalMethod;
      const { board } = app.state;
      let index = 1;
      const digitSevenExists = () => {
        const separatedDigits = index.toString().split('');
        return separatedDigits.some(digit => digit === '7');
      };

      board.board.forEach(row =>
        row.forEach(cell => {
          if (index % 7 === 0 || digitSevenExists()) cell.isMine = true;
          index++;
        })
      );

      index = 1;

      board.board.forEach(row =>
        row.forEach(cell => {
          if (index % 7 === 0 || digitSevenExists()) expect(cell.isMine).toBe(true);
          else expect(cell.isMine).toBe(false);
          index++;
        })
      );
    });
  });
});
