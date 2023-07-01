import { describe, expect, it } from 'vitest';
import { getRandomInt, getRandomUniqueNumbers } from './utils';

describe('getRandomInt()', () => {
  it('should throw an error when or max are not integers', () => {
    const min = 1.5;
    const max = 10.5;
    const resultFn = () => getRandomInt(min, max);
    expect(resultFn).toThrow('min and max must be integers');
  });

  it('should return an integer', () => {
    const result = getRandomInt(1, 10);
    expect(result).toBeTypeOf('number');
  });

  it('should return a number within the specified range', () => {
    const min = 1;
    const max = 10;
    const result = getRandomInt(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(max);
  });

  it('should handle negative numbers correctly', () => {
    const min = -10;
    const max = -1;
    const result = getRandomInt(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(max);
  });

  it('should return min when the min and max are equal', () => {
    const min = 10;
    const max = 10;
    const result = getRandomInt(min, max);
    expect(result).toBe(min);
  });

  it('should throw an error when the min is greater than max', () => {
    const min = 10;
    const max = 1;
    const resultFn = () => getRandomInt(min, max);
    expect(resultFn).toThrow('min must be less than or equal to max');
  });
});

describe('getRandomUniqueNumbers()', () => {
  it('should throw an error when max or limit are not integers', () => {
    const max = 10.5;
    const limit = 5;

    const resultFn = () => getRandomUniqueNumbers(max, limit);
    expect(resultFn).toThrow('max and limit must be integers');

    const max_2 = 10;
    const limit_2 = '5';
    const resultFn_2 = () => getRandomUniqueNumbers(max_2, limit_2);
    expect(resultFn_2).toThrow('max and limit must be integers');
  });

  it('should throw an error when max is smaller than limit', () => {
    const max = 5;
    const limit = 10;
    const resultFn = () => getRandomUniqueNumbers(max, limit);
    expect(resultFn).toThrow('max must be greater than limit');
  });

  it('should return array of length limit', () => {
    const limit = 5;
    const max = 10;
    const result = getRandomUniqueNumbers(max, limit);
    expect(result).toHaveLength(limit);
  });

  it('should return unique numbers', () => {
    const limit = 5;
    const max = 10;
    const result = getRandomUniqueNumbers(max, limit);
    const uniqueSet = new Set(result);
    expect(uniqueSet.size).toBe(limit);
  });

  it('should return numbers within range 0 to max exclusive', () => {
    const max = 10;
    const limit = 5;
    const result = getRandomUniqueNumbers(max, limit);
    for (let num of result) {
      expect(num).toBeGreaterThanOrEqual(0);
      expect(num).toBeLessThan(max);
    }
  });
});
