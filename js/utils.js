function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function getRandomUniqueNumbers(x, y) {
  let numbers = Array.from({ length: x }, (_, i) => i);

  numbers.forEach((_, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  });

  return numbers.slice(0, y);
}

export { getRandomInt, getRandomUniqueNumbers };
