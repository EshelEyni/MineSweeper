class AppHistory {
  prevState = null;
  history = [];

  addState(state) {
    this.history.push(this.prevState);
    this.prevState = this.#setCopyOfState(state);
  }

  getLastState() {
    if (!this.history.length) return null;
    return this.history.pop();
  }

  #setCopyOfState(state) {
    return {
      livesCount: state.livesCount,
      minesCount: state.minesCount,
      flagCount: state.flagCount,
      safeClickCount: state.safeClickCount,
      hintsCount: state.hintsCount,
      board: state.board.clone(),
    };
  }
}

export default AppHistory;
