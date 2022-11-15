'use strict'

function gameOver(num) {
    if (num < 0) {
        clearInterval(intervalTimer)
        gTimer = false
        for (var i = 0; i < gState.board.length; i++) {
            for (var j = 0; j < gState.board[i].length; j++) {
                if (gState.board[i][j].isMine) {
                    const elCell = document.querySelector(`.cell-${i}-${j}`)
                    elCell.innerHTML = gMine

                }
            }
        }

        var gameOverMsg = document.querySelector(`.gameover`)
        gameOverMsg.style.display = 'flex'
        gameOverMsg.innerHTML = 'YOU LOST'
        const elSmiley = document.querySelector('.Smiley')
        elSmiley.innerHTML = LOSE_IMG
    }

}

function victory() {
    var victoryCount = (gState.board.length) * (gState.board[0].length)
    for (var i = 0; i < gState.board.length; i++) {
        for (var j = 0; j < gState.board[i].length; j++) {
            if ((gState.board[i][j].isMine && gState.board[i][j].isMarked
                && !gState.board[i][j].isShown) || gState.board[i][j].isShown
            ) {
                victoryCount--
            }
        }
    }

    if (!victoryCount) {
        prevTime = time
        bestScore()
        clearInterval(intervalTimer)
        // gTimer = false
        var victoryMsg = document.querySelector(`.gameover`)
        victoryMsg.style.display = 'flex'
        victoryMsg.innerHTML = 'YOU WON'
        const elSmiley = document.querySelector('.Smiley')
        elSmiley.innerHTML = WIN_IMG
    }


}


function difficulty(boardSqrt, numOfMines, numsOfLives) {
    clearInterval(intervalTimer)
    gTimer = false
    const timer = document.querySelector('.timer')
    timer.style.display = 'none'
    const gameOver = document.querySelector('.gameover')
    gameOver.style.display = 'none'
    gBoardSqrt = boardSqrt
    gState.board = buildBoard(createMat(boardSqrt, boardSqrt))
    renderBoard(gState.board, '.board-container')
    gState.lives = numsOfLives
    renderLives(numsOfLives)

    gNumOfMines = numOfMines
}

function smiley() {
    const elSmiley = document.querySelector('.Smiley')
    elSmiley.innerHTML = SMILEY_IMG
    clearInterval(intervalTimer)
    gTimer = false
    const timer = document.querySelector('.timer')
    timer.style.display = 'none'
    gState.board = buildBoard(createMat(gBoardSqrt, gBoardSqrt))
    renderBoard(gState.board, '.board-container')
    renderLives(3)

}
