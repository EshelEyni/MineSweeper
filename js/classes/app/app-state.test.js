import Board from '../board/board';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import AppState from './app-state';
import { gameConfig } from './app-state';

describe('AppState', () => {
  let appState;

  describe('constructor', () => {
    const hintDuration = 2500;
    const defaultPartialState = {
      hintDuration,
      intervalTimerId: undefined,
      gameTime: 0,
      isTimerRunning: false,
      isClickHint: false,
      isManualMineSetting: false,
      isMinesSet: false,
    };

    it('should initialize AppState with default parameters', () => {
      const appState = new AppState();
      const stateToCompare = {
        ...defaultPartialState,
        ...gameConfig.medium,
        board: new Board(gameConfig.medium.boardSqrt, hintDuration),
      };
      expect(appState).toBeInstanceOf(AppState);
      expect(appState).toEqual(stateToCompare);
    });

    it('should initialize AppState with provided difficulty', () => {
      const appState = new AppState('hard');
      const stateToCompare = {
        ...defaultPartialState,
        ...gameConfig.hard,
        board: new Board(gameConfig.hard.boardSqrt, hintDuration),
      };

      expect(appState).toBeInstanceOf(AppState);
      expect(appState).toEqual(stateToCompare);
    });
  });

  beforeEach(() => {
    appState = new AppState('hard');
  });

  describe('incrementTimer', () => {
    it('should increment gameTime by 1', () => {
      appState.incrementTimer();
      expect(appState.gameTime).toBe(1);
    });
  });

  describe('incrementFlagCount', () => {
    it('should increment flagCount by 1', () => {
      const flagCount = gameConfig.hard.flagCount;
      appState.incrementFlagCount();
      expect(appState.flagCount).toBe(flagCount + 1);
    });
  });

  describe('decrementFlagCount', () => {
    it('should decrement flagCount by 1', () => {
      const flagCount = gameConfig.hard.flagCount;
      appState.decrementFlagCount();
      expect(appState.flagCount).toBe(flagCount - 1);
    });
  });

  describe('decrementSafeClickCount', () => {
    it('should decrement safeClickCount by 1', () => {
      const safeClickCount = gameConfig.hard.safeClickCount;
      appState.decrementSafeClickCount();
      expect(appState.safeClickCount).toBe(safeClickCount - 1);
    });
  });

  describe('decrementHintsCount', () => {
    it('should decrement hintsCount by 1', () => {
      const hintCount = gameConfig.hard.hintsCount;
      appState.decrementHintsCount();
      expect(appState.hintsCount).toBe(hintCount - 1);
    });
  });

  describe('decrementLives', () => {
    it('should decrement lives by 1', () => {
      const livesCount = gameConfig.hard.lives;
      appState.decrementLives();
      expect(appState.lives).toBe(livesCount - 1);
    });
  });

  describe('decrementMinesCount', () => {
    it('should decrement minesCount by 1', () => {
      const minesCount = gameConfig.hard.minesCount;
      appState.decrementMinesCount();
      expect(appState.minesCount).toBe(minesCount - 1);
    });
  });

  describe('toggleIsMinesSet', () => {
    it('should toggle the boolean value of isMinesSet', () => {
      expect(appState.isMinesSet).toBe(false);
      appState.toggleIsMinesSet();
      expect(appState.isMinesSet).toBe(true);
      appState.toggleIsMinesSet();
      expect(appState.isMinesSet).toBe(false);
    });
  });

  describe('toggleIsManualMineSetting', () => {
    it('should toggle the boolean value of isManualMineSetting', () => {
      expect(appState.isManualMineSetting).toBe(false);
      appState.toggleIsManualMineSetting();
      expect(appState.isManualMineSetting).toBe(true);
      appState.toggleIsManualMineSetting();
      expect(appState.isManualMineSetting).toBe(false);
    });
  });

  describe('toggleIsClickHint', () => {
    it('should toggle the boolean value of isClickHint', () => {
      expect(appState.isClickHint).toBe(false);
      appState.toggleIsClickHint();
      expect(appState.isClickHint).toBe(true);
      appState.toggleIsClickHint();
      expect(appState.isClickHint).toBe(false);
    });
  });

  describe('toggleIsTimerRunning', () => {
    it('should toggle the boolean value of isTimerRunning', () => {
      expect(appState.isTimerRunning).toBe(false);
      appState.toggleIsTimerRunning();
      expect(appState.isTimerRunning).toBe(true);
      appState.toggleIsTimerRunning();
      expect(appState.isTimerRunning).toBe(false);
    });
  });

  describe(' setTimer', () => {
    afterEach(() => {
      appState.gameTime = 0;
    });

    it('should increment gameTime and return seconds as 1 when the method is called for the first time', () => {
      const result = appState.setTimer();
      expect(result).toEqual({ minutes: 0, seconds: 1 });
      expect(appState.gameTime).toBe(1);
    });

    it('should return correct minutes and seconds when the method is called 60 times', () => {
      for (let i = 0; i < 59; i++) appState.setTimer();
      const result = appState.setTimer();
      expect(result).toEqual({ minutes: 1, seconds: 0 });
      expect(appState.gameTime).toBe(60);
    });

    it('should handle gameTime that is over an hour', () => {
      appState.gameTime = 3600; // simulate an hour has passed

      const result = appState.setTimer();
      expect(result).toEqual({ minutes: 60, seconds: 1 });
      expect(appState.gameTime).toBe(3601);
    });

    it('should correctly calculate minutes and seconds when gameTime is not a multiple of 60', () => {
      appState.gameTime = 65;

      const result = appState.setTimer();
      expect(result).toEqual({ minutes: 1, seconds: 6 });
      expect(appState.gameTime).toBe(66);
    });
  });

  describe('setPrevState', () => {
    it('should correctly update the current state with the values of the provided previous state', () => {
      const prevState = {
        lives: 12,
        minesCount: 12,
        flagCount: 12,
        safeClickCount: 12,
        hintsCount: 12,
        board: new Board(12),
      };

      appState.setPrevState(prevState);

      expect(appState).toEqual(expect.objectContaining(prevState));
    });
  });

  describe('startGame', () => {
    beforeEach(() => {
      // We're going to mock setRandomMines and toggle methods to isolate our tests
      appState.board.setRandomMines = vi.fn();
      appState.toggleIsMinesSet = vi.fn();
      appState.toggleIsTimerRunning = vi.fn();
    });

    it('should not execute if the timer is already running', () => {
      appState.isTimerRunning = true;
      appState.startGame();

      expect(appState.board.setRandomMines).not.toHaveBeenCalled();
      expect(appState.toggleIsMinesSet).not.toHaveBeenCalled();
      expect(appState.toggleIsTimerRunning).not.toHaveBeenCalled();
    });

    it('should set random mines if mines are not set yet', () => {
      appState.isMinesSet = false;
      appState.startGame();

      expect(appState.board.setRandomMines).toHaveBeenCalledWith(appState.minesCount);
      expect(appState.toggleIsMinesSet).toHaveBeenCalled();
    });

    it('should not set random mines if mines are already set', () => {
      appState.isMinesSet = true;
      appState.startGame();

      expect(appState.board.setRandomMines).not.toHaveBeenCalled();
    });

    it('should toggle isTimerRunning', () => {
      appState.startGame();

      expect(appState.toggleIsTimerRunning).toHaveBeenCalled();
    });
  });

  describe('onGameLoss', () => {
    beforeEach(() => {
      appState.board = new Board(12);
      appState.board.loopThroughCells = vi.fn();
    });

    it('should reset the timer and reveal all cells that are mines', () => {
      appState.startGame();
      appState.onGameLoss();
      expect(appState.intervalTimerId).toBeUndefined();
      expect(appState.isTimerRunning).toBe(false);
      //   expect(appState.board.loopThroughCells).toHaveBeenCalled();
    });
  });
});
