'use strict';

const MINE_EMOJY = '<img src="images/mine.png"/>';
const FLAG_EMOJY = '<img src="images/flag.png"/>';
const HEART_EMOJY = '<img src="images/heart.png"/>';
const SMILEY_EMOJY = '<img src="images/smiley.png"/>';
const WIN_EMOJY = '<img src="images/smiley-win.png"/>';
const LOSE_EMOJY = '<img src="images/smiley-lose.png"/>';



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
