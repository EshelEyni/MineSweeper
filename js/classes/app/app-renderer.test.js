import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import AppRenderer from './app-renderer';
import AppState from './app-state';
import { jsdom } from '../../test-dom';
import { SMILEY_MONOCLE_IMG } from '../../image-assets';

describe('AppRenderer', () => {
  let appRenderer;

  beforeAll(() => {
    global.window = jsdom.window;
    global.document = jsdom.window.document;
  });

  describe('constructor', () => {
    it('should set the correct appState when constructed', () => {
      const mockAppState = {
        board: [],
        lives: 3,
        flagCount: 0,
        safeClickCount: 0,
        hintsCount: 0,
        difficultyName: 'easy',
      };
      const appRenderer = new AppRenderer(mockAppState);
      expect(appRenderer.appState).toEqual(mockAppState);
    });
  });

  describe('app', () => {
    let mockAppState;

    beforeEach(() => {
      mockAppState = { board: { render: vi.fn() } };

      appRenderer = new AppRenderer(mockAppState);
      appRenderer.safeClickCount = vi.fn();
      appRenderer.hints = vi.fn();
      appRenderer.lives = vi.fn();
      appRenderer.flagCounter = vi.fn();
      appRenderer.timer = vi.fn();
      appRenderer.bestScore = vi.fn();
    });

    it('should call the right methods when app is called with isUndoAction = false', () => {
      appRenderer.app({ isUndoAction: false });
      expect(appRenderer.safeClickCount).toHaveBeenCalled();
      expect(appRenderer.hints).toHaveBeenCalled();
      expect(mockAppState.board.render).toHaveBeenCalled();
      expect(appRenderer.lives).toHaveBeenCalled();
      expect(appRenderer.flagCounter).toHaveBeenCalled();
      expect(appRenderer.timer).toHaveBeenCalled();
      expect(appRenderer.bestScore).toHaveBeenCalled();
    });

    it('should not call timer and bestScore methods when app is called with isUndoAction = true', () => {
      appRenderer.app({ isUndoAction: true });
      expect(appRenderer.safeClickCount).toHaveBeenCalled();
      expect(appRenderer.hints).toHaveBeenCalled();
      expect(mockAppState.board.render).toHaveBeenCalled();
      expect(appRenderer.lives).toHaveBeenCalled();
      expect(appRenderer.flagCounter).toHaveBeenCalled();
      expect(appRenderer.timer).not.toHaveBeenCalled();
      expect(appRenderer.bestScore).not.toHaveBeenCalled();
    });
  });

  describe('safeClickCount', () => {
    let mockAppState;

    it('should call safeClickCounter with the correct arguments', () => {
      const safeClickCountElement = document.querySelector('.safe-click-count');
      mockAppState = { safeClickCount: 3 };
      appRenderer = new AppRenderer(mockAppState);
      appRenderer.safeClickCount(safeClickCountElement);
      expect(safeClickCountElement.innerHTML).toEqual(`${mockAppState.safeClickCount}`);
    });
  });

  describe('hints', () => {
    let mockAppState;

    const div = document.createElement('div');
    div.innerHTML = SMILEY_MONOCLE_IMG;
    const normalizedSMILEY_MONOCLE_IMG = div.innerHTML;

    beforeEach(() => {
      mockAppState = { hintsCount: 3 };
      appRenderer = new AppRenderer(mockAppState);
    });

    it('should not set hintsContainerElement innerHTML when hintsCount is 0', () => {
      const hintsContainerElement = document.querySelector('.hints-container');
      mockAppState.hintsCount = 0;
      appRenderer.hints(hintsContainerElement);
      expect(hintsContainerElement.innerHTML).toEqual('');
    });

    it('should set hintsContainerElement innerHTML when hintsCount is greater than 0', () => {
      const hintsContainerElement = document.querySelector('.hints-container');

      let expepectedInnerHTML = '';
      const { hintsCount } = mockAppState;
      for (let i = 0; i < hintsCount; i++) {
        expepectedInnerHTML += `<button class="hint inset-border" data-idx="${i}">${normalizedSMILEY_MONOCLE_IMG}</button>`;
      }

      appRenderer.hints(hintsContainerElement);
      expect(hintsContainerElement.innerHTML).toEqual(expepectedInnerHTML);
    });
  });

  describe('bestScore', () => {
    let mockAppState;

    it('should render default best score when bestScore is null', () => {
      const bestScoreElement = document.querySelector('.best-score-container');
      mockAppState = {
        difficultyName: 'easy',
        storage: {
          getBestScore: vi.fn(() => null),
        },
      };
      appRenderer = new AppRenderer(mockAppState);
      const div = document.createElement('div');
      div.innerHTML = `<span>BEST SCORE: 00:00</span>`;
      const expectedInnerHTML = div.innerHTML;

      appRenderer.bestScore(bestScoreElement);
      expect(bestScoreElement.innerHTML).toEqual(expectedInnerHTML);
    });

    it('should render best score when bestScore is not null', () => {
      const bestScoreElement = document.querySelector('.best-score-container');
      mockAppState = {
        difficultyName: 'easy',
        storage: {
          getBestScore: vi.fn(() => 1),
        },
      };
      appRenderer = new AppRenderer(mockAppState);
      const div = document.createElement('div');
      div.innerHTML = `<span>BEST SCORE: 0:01</span>`;
      const expectedInnerHTML = div.innerHTML;

      appRenderer.bestScore(bestScoreElement);
      expect(bestScoreElement.innerHTML).toEqual(expectedInnerHTML);
    });

    it('should render best score when bestScore is greater than 60', () => {
      const bestScoreElement = document.querySelector('.best-score-container');
      mockAppState = {
        difficultyName: 'easy',
        storage: {
          getBestScore: vi.fn(() => 61),
        },
      };
      appRenderer = new AppRenderer(mockAppState);
      const div = document.createElement('div');
      div.innerHTML = `<span>BEST SCORE: 1:01</span>`;
      const expectedInnerHTML = div.innerHTML;

      appRenderer.bestScore(bestScoreElement);
      expect(bestScoreElement.innerHTML).toEqual(expectedInnerHTML);
    });
  });
});
