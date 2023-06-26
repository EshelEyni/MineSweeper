'use strict';

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


const mineSweeperRedFlagSVG = `
  <svg class="red-flag" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M512 512H0V0h512v512z" fill="none"/>
    <path d="M256 0C114.84 0 0 114.84 0 256s114.84 256 256 256 256-114.84 256-256S397.16 0 256 0zm0 480C132.48 480 32 379.52 32 256S132.48 32 256 32s224 100.48 224 224-100.48 224-224 224z"/>
    <path d="M256 128c-17.664 0-32 14.336-32 32v192c0 17.664 14.336 32 32 32s32-14.336 32-32V160c0-17.664-14.336-32-32-32z"/>
    <path d="M256 64c-17.664 0-32 14.336-32 32v32c0 17.664 14.336 32 32 32s32-14.336 32-32V96c0-17.664-14.336-32-32-32z"/>
    </svg>`