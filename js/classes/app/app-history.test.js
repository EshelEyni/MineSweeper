import Board from '../board/board';
import AppHistory from './app-history';
import { beforeEach, describe, expect, it } from 'vitest';

describe('AppHistory', () => {
  describe('constructor', () => {
    it('should create an instance of AppHistory', () => {
      const appHistory = new AppHistory();
      expect(appHistory).toBeInstanceOf(AppHistory);
    });

    it('should initialize a new AppHistory instance with an empty history array and a null previous state', () => {
      const appHistory = new AppHistory();
      const { history, prevState } = appHistory;
      expect(history).toEqual([]);
      expect(prevState).toBeNull();
    });
  });

  describe('addState', () => {
    let appHistory, board;

    beforeEach(() => {
      appHistory = new AppHistory();
      board = new Board(8);
    });

    it('should add a previous state to the history and set the current state', () => {
      const state = {
        livesCount: 3,
        minesCount: 5,
        flagCount: 2,
        safeClickCount: 2,
        hintsCount: 3,
        board,
      };

      appHistory.addState(state);
      expect(appHistory.history[0]).toBeNull();
      expect(appHistory.prevState).toEqual(state);
    });

    it('should add multiple states to the history and always set the current state as the previous state', () => {
      const state1 = {
        livesCount: 3,
        minesCount: 5,
        flagCount: 2,
        safeClickCount: 2,
        hintsCount: 3,
        board,
      };
      const state2 = {
        livesCount: 2,
        minesCount: 4,
        flagCount: 3,
        safeClickCount: 1,
        hintsCount: 2,
        board,
      };

      appHistory.addState(state1);
      appHistory.addState(state2);
      expect(appHistory.history[0]).toBeNull();
      expect(appHistory.history[1]).toEqual(state1);
      expect(appHistory.prevState).toEqual(state2);
    });

    it('should not affect the history when the original state object is mutated after adding', () => {
      const originallivesCount = 3;
      const newlivesCount = 2;
      const originalState = {
        livesCount: originallivesCount,
        minesCount: 5,
        flagCount: 2,
        safeClickCount: 2,
        hintsCount: 3,
        board,
      };

      appHistory.addState(originalState);
      originalState.livesCount = newlivesCount;
      expect(appHistory.prevState.livesCount).toBe(originallivesCount);
    });
  });

  describe('getLastState', () => {
    let appHistory, board, state_1, state_2, state_3, state_4;

    beforeEach(() => {
      appHistory = new AppHistory();
      board = new Board(8);

      state_1 = {
        livesCount: 3,
        minesCount: 5,
        flagCount: 2,
        safeClickCount: 2,
        hintsCount: 3,
        board,
      };
      state_2 = {
        livesCount: 2,
        minesCount: 4,
        flagCount: 1,
        safeClickCount: 1,
        hintsCount: 2,
        board,
      };
      state_3 = {
        livesCount: 1,
        minesCount: 3,
        flagCount: 0,
        safeClickCount: 0,
        hintsCount: 1,
        board,
      };
      state_4 = {
        livesCount: 1,
        minesCount: 2,
        flagCount: 0,
        safeClickCount: 0,
        hintsCount: 0,
        board,
      };
    });

    it('should return null when the history is empty', () => {
      const returnedState = appHistory.getLastState();
      expect(returnedState).toBeNull();
    });

    it('should return the last state added to history', () => {
      appHistory.addState(state_1);
      appHistory.addState(state_2);
      expect(appHistory.prevState).toEqual(state_2);
      expect(appHistory.getLastState()).toEqual(state_1);
    });

    it('should remove the returned state from history', () => {
      appHistory.addState(state_1);
      appHistory.addState(state_2);
      appHistory.getLastState();
      const returnedState = appHistory.history;
      const expectedState = [null];
      expect(appHistory.prevState).toEqual(state_2);
      expect(returnedState).toEqual(expectedState);
    });

    it('should return the last state added to history when called multiple times', () => {
      appHistory.addState(state_1);
      appHistory.addState(state_2);
      appHistory.addState(state_3);
      appHistory.addState(state_4);
      expect(appHistory.prevState).toEqual(state_4);
      expect(appHistory.getLastState()).toEqual(state_3);
      expect(appHistory.getLastState()).toEqual(state_2);
      expect(appHistory.getLastState()).toEqual(state_1);
    });

    it('Should consistently return the latest state from getLastState, even when new states are added after its previous invocation', () => {
      appHistory.addState(state_1);
      appHistory.addState(state_2);
      const firstReturnedState = appHistory.getLastState();
      expect(firstReturnedState).toEqual(state_1);
      appHistory.addState(state_3);
      const secondReturnedState = appHistory.getLastState();
      expect(appHistory.prevState).toEqual(state_3);
      expect(secondReturnedState).toEqual(state_2);
      appHistory.addState(state_4);
      const thirdReturnedState = appHistory.getLastState();
      expect(appHistory.prevState).toEqual(state_4);
      expect(thirdReturnedState).toEqual(state_3);
    });
  });
});
