class AppStorage {
  getBestScore(difficultyName) {
    this.#isValidDifficultyName(difficultyName);
    const storageValue = window.localStorage.getItem(difficultyName);
    return storageValue ? Number(storageValue) : null;
  }

  setBestScore(difficultyName, gameTime) {
    if (!difficultyName || !gameTime)
      throw new Error('Difficulty name or game time is not defined');
    this.#isValidDifficultyName(difficultyName);
    this.#isGameTimeValid(gameTime);
    const storageValue = window.localStorage.getItem(difficultyName);
    const prevBestScore = storageValue ? Number(storageValue) : null;
    const isBestScore = prevBestScore === null || prevBestScore > gameTime;
    if (!isBestScore) return;
    window.localStorage.setItem(difficultyName, gameTime);
  }

  #isGameTimeValid(gameTime) {
    if (!gameTime) throw new Error('Game time is not defined');
    if (typeof gameTime !== 'number') throw new Error('Game time is not a number');
    if (gameTime < 0) throw new Error('Game time is less than 0');
  }

  #isValidDifficultyName(difficultyName) {
    if (!difficultyName) throw new Error('Difficulty name is not defined');
    if (typeof difficultyName !== 'string') throw new Error('Difficulty name is not a string');
    const valiedDifficultyNames = new Set(['easy', 'medium', 'hard']);
    if (!valiedDifficultyNames.has(difficultyName)) throw new Error('Difficulty name is not valid');
  }
}

export default AppStorage;
