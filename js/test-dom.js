import { JSDOM } from 'jsdom';

const jsdom = new JSDOM(`
  <!DOCTYPE html>
  <html>
    <body>
        <main class="app">
            <h1 class="app-title">Mine Sweeper!</h1>

            <div class="game-actions">
                <button class="btn-undo-action inset-border">UNDO!</button>
                <button class="btn-safe-click inset-border">
                    <span class="safe-click-count"></span>
                    <span> Safe Click </span>
                </button>
                <div class="hints-container"></div>
            </div>

            <div class="main-container">
                <div class="game-stats-container">
                    <div class="best-score-container"></div>
                    <div class="lives-container"></div>
                </div>
                <div class="board-container inset-border">
                    <header class="board-header">
                        <div class="flag-counter"></div>
                        <div class="smiley-container inset-border"><img src="images/smiley.png" /></div>
                        <div class="timer">000</div>
                    </header>
                    <table class="board"></table>
                </div>
            </div>

            <div class="app-game-setting">
                <div class="btn-difficulty-container">
                    <button class="inset-border" data-difficulty-name="easy">Easy(8*8)</button>
                    <button class="inset-border" data-difficulty-name="medium">medium(12*12)</button>
                    <button class="inset-border" data-difficulty-name="hard">hard(16*16)</button>
                </div>
                <div class="custom-game-setting-container">
                    <button class="btn-set-mines-manually inset-border">Manuall Mines!</button>
                    <button class="btn-set-seven-boom inset-border">7 BOOM!!!</button>
                </div>
            </div>

            <div class="footer">
                <p>Created By Eshel Eyni</p>
            </div>
        </main>
    </body>
  </html>
`);

const { document } = jsdom.window;
document.documentElement.style.setProperty('--hint-color', 'rgb(233, 214, 111)');
document.documentElement.style.setProperty('--mine-color', 'rgba(212, 5, 5, 0.8)');
document.documentElement.style.setProperty('--safe-click-color', 'rgb(56, 148, 197)');

export { jsdom };
