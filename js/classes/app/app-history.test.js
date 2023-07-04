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
        lives: 3,
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
        lives: 3,
        minesCount: 5,
        flagCount: 2,
        safeClickCount: 2,
        hintsCount: 3,
        board,
      };
      const state2 = {
        lives: 2,
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
      const originalLives = 3;
      const newLives = 2;
      const originalState = {
        lives: originalLives,
        minesCount: 5,
        flagCount: 2,
        safeClickCount: 2,
        hintsCount: 3,
        board,
      };

      appHistory.addState(originalState);
      originalState.lives = newLives;
      expect(appHistory.prevState.lives).toBe(originalLives);
    });
  });

  describe('getLastState', () => {
    let appHistory, board, state1, state2;

    beforeEach(() => {
      appHistory = new AppHistory();
      board = new Board(8);

      state1 = {
        lives: 3,
        minesCount: 5,
        flagCount: 2,
        safeClickCount: 2,
        hintsCount: 3,
        board,
      };
      state2 = {
        lives: 2,
        minesCount: 4,
        flagCount: 1,
        safeClickCount: 1,
        hintsCount: 2,
        board,
      };
    });

    it('should return null when the history is empty', () => {
      const returnedState = appHistory.getLastState();
      expect(returnedState).toBeNull();
    });

    it('should return the last state added to history', () => {
      appHistory.addState(state1);
      appHistory.addState(state2);
      expect(appHistory.getLastState()).toEqual(state1);
    });

    it('should remove the returned state from history', () => {
      appHistory.addState(state1);
      appHistory.addState(state2);
      appHistory.getLastState();
      expect(appHistory.history).toEqual([]);
    });
  });
});
