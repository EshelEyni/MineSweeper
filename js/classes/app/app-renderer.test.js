import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import AppRenderer from './app-renderer';
import { jsdom } from '../../test-dom';
import {
  HEART_IMG,
  SMILEY_IMG,
  SMILEY_LOSE_IMG,
  SMILEY_MONOCLE_IMG,
  SMILEY_SHOCKED_IMG,
  SMILEY_WIN_IMG,
} from '../../image-assets';

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

  describe('lives', () => {
    let mockAppState;

    it('should render default lives when lives is 0', () => {
      const livesContainerElement = document.querySelector('.lives-container');
      mockAppState = { lives: 0 };
      appRenderer = new AppRenderer(mockAppState);
      const expectedInnerHTML = '';
      appRenderer.lives(livesContainerElement);
      expect(livesContainerElement.innerHTML).toEqual(expectedInnerHTML);
    });

    it('should render lives when lives is greater than 0', () => {
      const livesContainerElement = document.querySelector('.lives-container');
      mockAppState = { lives: 3 };
      appRenderer = new AppRenderer(mockAppState);
      const div = document.createElement('div');
      div.innerHTML = HEART_IMG.repeat(mockAppState.lives);
      const expectedInnerHTML = div.innerHTML;
      appRenderer.lives(livesContainerElement);
      expect(livesContainerElement.innerHTML).toEqual(expectedInnerHTML);

      mockAppState = { lives: 2 };
      appRenderer = new AppRenderer(mockAppState);
      div.innerHTML = HEART_IMG.repeat(mockAppState.lives);
      const expectedInnerHTML_2 = div.innerHTML;
      appRenderer.lives(livesContainerElement);
      expect(livesContainerElement.innerHTML).toEqual(expectedInnerHTML_2);
    });
  });

  describe('Smiley Rendering', () => {
    beforeEach(() => {
      appRenderer = new AppRenderer();
    });

    it('should render default smiley when is smileyDefault() is called', () => {
      const smileyContainerElement = document.querySelector('.smiley-container');
      const div = document.createElement('div');
      div.innerHTML = SMILEY_IMG;
      const normalizedSMILEY_IMG = div.innerHTML;
      const expectedInnerHTML = normalizedSMILEY_IMG;
      appRenderer.smileyDefault(smileyContainerElement);
      expect(smileyContainerElement.innerHTML).toEqual(expectedInnerHTML);
    });

    it('should render default smiley when is smileyLoss() is called', () => {
      const smileyContainerElement = document.querySelector('.smiley-container');
      const div = document.createElement('div');
      div.innerHTML = SMILEY_LOSE_IMG;
      const normalizedSMILEY_LOSE_IMG = div.innerHTML;
      const expectedInnerHTML = normalizedSMILEY_LOSE_IMG;
      appRenderer.smileyLoss(smileyContainerElement);
      expect(smileyContainerElement.innerHTML).toEqual(expectedInnerHTML);
    });

    it('should render default smiley when is smileyWin() is called', () => {
      const smileyContainerElement = document.querySelector('.smiley-container');
      const div = document.createElement('div');
      div.innerHTML = SMILEY_WIN_IMG;
      const normalizedSMILEY_WIN_IMG = div.innerHTML;
      const expectedInnerHTML = normalizedSMILEY_WIN_IMG;
      appRenderer.smileyWin(smileyContainerElement);
      expect(smileyContainerElement.innerHTML).toEqual(expectedInnerHTML);
    });

    it('should render default smiley when is smileyShocked() is called', () => {
      const smileyContainerElement = document.querySelector('.smiley-container');
      const div = document.createElement('div');
      div.innerHTML = SMILEY_SHOCKED_IMG;
      const normalizedSMILEY_SHOCKED_IMG = div.innerHTML;
      const expectedInnerHTML = normalizedSMILEY_SHOCKED_IMG;
      appRenderer.smileyShocked(smileyContainerElement);
      expect(smileyContainerElement.innerHTML).toEqual(expectedInnerHTML);
    });
  });

  describe('toggleBtnActiveSetMinesManually', () => {
    const expectedClassName = 'active';

    it('should toggle btn active class when isSetMinesManually() is called', () => {
      appRenderer = new AppRenderer();
      const btnSetMinesManually = document.querySelector('.btn-set-mines-manually');
      appRenderer.toggleBtnActiveSetMinesManually(btnSetMinesManually);
      const classListArray_1 = Array.from(btnSetMinesManually.classList);
      expect(classListArray_1).toContain(expectedClassName);
      appRenderer.toggleBtnActiveSetMinesManually(btnSetMinesManually);
      const classListArray_2 = Array.from(btnSetMinesManually.classList);
      expect(classListArray_2).not.toContain(expectedClassName);
    });
  });

  describe('flagCounter', () => {
    it('should render flag counter when is flagCount is greater than or equal to 0', () => {
      const formmatedFlagCount = flagCount => flagCount.toString().padStart(3, '0');
      const flagCounterElement = document.querySelector('.flag-counter');
      const mockAppState = { flagCount: 10 };
      appRenderer = new AppRenderer(mockAppState);
      appRenderer.flagCounter(flagCounterElement);
      expect(flagCounterElement.innerHTML).toEqual(formmatedFlagCount(mockAppState.flagCount));

      const mockAppState_2 = { flagCount: 0 };
      appRenderer = new AppRenderer(mockAppState_2);
      appRenderer.flagCounter(flagCounterElement);
      expect(flagCounterElement.innerHTML).toEqual(formmatedFlagCount(mockAppState_2.flagCount));
    });

    it('should render flag counter when is flagCount is smaller than 0', () => {
      const formmatedFlagCount = flagCount => flagCount.toString().padStart(0, '0');
      const flagCounterElement = document.querySelector('.flag-counter');
      const mockAppState = { flagCount: -1 };
      appRenderer = new AppRenderer(mockAppState);
      appRenderer.flagCounter(flagCounterElement);
      expect(flagCounterElement.innerHTML).toEqual(formmatedFlagCount(mockAppState.flagCount));
    });
  });

  describe('timer', () => {
    beforeEach(() => {
      appRenderer = new AppRenderer();
    });

    it('should render correct default time', () => {
      const timerElement = document.querySelector('.timer');
      const expectedInnerHTML = '000';
      appRenderer.timer(timerElement);
      expect(timerElement.innerHTML).toBe(expectedInnerHTML);
    });

    it('should render correct time when time is greater than 0', () => {
      const timerElement = document.querySelector('.timer');
      const time = {
        minutes: 1,
        seconds: 9,
      };
      const expectedInnerHTML = '1:09';
      appRenderer.timer(timerElement, time);
      expect(timerElement.innerHTML).toBe(expectedInnerHTML);
    });
  });
});
