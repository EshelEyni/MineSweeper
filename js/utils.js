function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomUniqueNumbers(max, limit) {
  const numbers = Array.from({ length: max }, (_, i) => i);

  numbers.forEach((_, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  });

  return numbers.slice(0, limit);
}

export { getRandomInt, getRandomUniqueNumbers };
