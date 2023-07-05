import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it } from 'vitest';
import AppStorage from './app-storage';

describe('AppStorage', () => {
  let appStorage;
  let jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
  global.window = jsdom.window;
  global.document = window.document;
  global.localStorage = window.localStorage;

  beforeEach(() => {
    appStorage = new AppStorage();
    localStorage.clear();
  });

  describe('getBestScore', () => {
    it('should throw error if difficulty name is not defined', () => {
      const resultFn = () => appStorage.getBestScore();
      expect(resultFn).toThrow('Difficulty name is not defined');
    });

    it('should throw error if difficulty name is not a string', () => {
      const resultFn = () => appStorage.getBestScore(1);
      expect(resultFn).toThrow('Difficulty name is not a string');
    });

    it('should throw error if difficulty name is not valid', () => {
      const resultFn = () => appStorage.getBestScore('invalid');
      expect(resultFn).toThrow('Difficulty name is not valid');
    });

    it('should return null if no best score is set', () => {
      const bestScore = appStorage.getBestScore('easy');
      expect(bestScore).toBeNull();
    });

    it('should return the best score if it is set', () => {
      localStorage.setItem('easy', 200);
      const bestScore = appStorage.getBestScore('easy');
      expect(bestScore).toBe(200);
    });
  });

  describe('setBestScore', () => {
    it('should throw error if difficulty name or gameTime is not defined', () => {
      const resultFn = () => appStorage.setBestScore();
      expect(resultFn).toThrow('Difficulty name or game time is not defined');
    });

    it('should throw error if difficulty name is not a string', () => {
      const resultFn = () => appStorage.setBestScore(1, 1);
      expect(resultFn).toThrow('Difficulty name is not a string');
    });

    it('should throw error if difficulty name is not valid', () => {
      const resultFn = () => appStorage.setBestScore('invalid', 1);
      expect(resultFn).toThrow('Difficulty name is not valid');
    });

    it('should throw error if game time is not a number', () => {
      const resultFn = () => appStorage.setBestScore('easy', '1');
      expect(resultFn).toThrow('Game time is not a number');
    });

    it('should throw error if game time is less than 0', () => {
      const resultFn = () => appStorage.setBestScore('easy', -1);
      expect(resultFn).toThrow('Game time is less than 0');
    });

    it('should set the best score if it is not set', () => {
      appStorage.setBestScore('easy', 200);
      const bestScore = localStorage.getItem('easy');
      expect(bestScore).toBe('200');
    });

    it('should set the best score if it is less than the previous one', () => {
      localStorage.setItem('easy', 200);
      appStorage.setBestScore('easy', 100);
      const bestScore = localStorage.getItem('easy');
      expect(bestScore).toBe('100');
    });

    it('should not set the best score if it is greater than the previous one', () => {
      localStorage.setItem('easy', 200);
      appStorage.setBestScore('easy', 300);
      const bestScore = localStorage.getItem('easy');
      expect(bestScore).toBe('200');
    });
  });
});
