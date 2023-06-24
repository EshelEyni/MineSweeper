'use strict';

// Emoji's
const gMine = '💣';
const gFlag = '🚩';
const LIVE_IMG = '❤️';

// Images
const SMILEY_IMG = '<img src="images/defsmiley.png" />';
const WIN_IMG = '<img src="images/win.png" />';
const LOSE_IMG = '<img src="images/lose.png" />';

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function makeId() {
  var length = 12;
  var txt = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

function getRandomUniqueNumbers(x, y) {
  let numbers = Array.from({ length: x }, (_, i) => i);

  numbers.forEach((_, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  });

  return numbers.slice(0, y);
}

function deepCopyWithPrototypes(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  let copy = Object.create(Object.getPrototypeOf(obj));

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepCopyWithPrototypes(obj[key]);
    }
  }

  return copy;
}
