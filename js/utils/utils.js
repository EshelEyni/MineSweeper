function getRandomInt(min, max) {
  if (!Number.isInteger(min) || !Number.isInteger(max))
    throw new Error('min and max must be integers');
  if (min > max) throw new Error('min must be less than or equal to max');
  if (min === max) return min;
  const roundedMin = Math.ceil(min);
  const roundedMax = Math.floor(max);
  return Math.floor(Math.random() * (roundedMax - roundedMin) + roundedMin);
}

function getRandomUniqueNumbers(max, limit) {
  if (!Number.isInteger(max) || !Number.isInteger(limit))
    throw new Error('max and limit must be integers');
  if (max <= limit) throw new Error('max must be greater than limit');

  const numbers = Array.from({ length: max }, (_, i) => i);

  numbers.forEach((_, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  });

  return numbers.slice(0, limit);
}

const isTestEnv = process.env.NODE_ENV === 'test';


export { getRandomInt, getRandomUniqueNumbers, isTestEnv };
