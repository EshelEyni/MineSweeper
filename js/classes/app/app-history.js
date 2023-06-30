class AppHistory {
  addState(state) {
    this.history.push(this.prevState);
    this.prevState = this.#setCopyOfState(state);
  }

  getState() {
    if (this.history.length === 1) return null;
    return this.history.pop();
  }

  #setCopyOfState(state) {
    return {
      lives: state.lives,
      minesCount: state.minesCount,
      flagCount: state.flagCount,
      safeClickCount: state.safeClickCount,
      hintsCount: state.hintsCount,
      board: state.board.clone(),
    };
  }

  history = [null];
  prevState = null;
}

export default AppHistory;
