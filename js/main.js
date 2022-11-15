'use strict'

// GLOBAL VAR SECTION
var gMine = '💣'
var gFlag = '🚩'

var gHint = false
var HINT_IMG = `💡`
var hintsIdx
var SMILEY_IMG = '<img src="images/defsmiley.png" />';
var WIN_IMG = '<img src="images/win.png" />';
var LOSE_IMG = '<img src="images/lose.png" />';

var nums = 0

var time
var prevTime
var gTimer
var intervalTimer
var gFirstClickTime

var gNumOfMines = 2
var gBoardSqrt = 4

var gNumsSafeClick = 3

var gMinesManuallMode = false

var gUndoState = []

var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gState = {
    board: null,
    lives: null
}


// END SECTION



function init() {
    const elSmiley = document.querySelector('.Smiley')
    elSmiley.innerHTML = SMILEY_IMG
    gTimer = false
    gState.lives = 1
    gState.board = buildBoard(createMat(gBoardSqrt, gBoardSqrt))
    render()
}

function render() {
    renderBoard(gState.board, '.board-container')
    renderLives(1)
    renderNumsSafeClick()
    renderHints()
}

function cellClicked(elCell, i, j) {
    gUndoState.push(JSON.stringify(gState));

    if (gMinesManuallMode) {
        gState.board[i][j].isMine = true
        gState.board[i][j].minesAroundCount = 0
        gNumOfMines--
        if (gNumOfMines === 0) {
            gMinesManuallMode = false
        }
        setMinesNegsCount(i, j, gState.board)
        return
    }

    if (gState.board[i][j].isMarked) return

    if (gHint) {
        revealByHint(i, j, gState.board)
        setTimeout(hideHint, 1000, i, j, gState.board)
        return
    }


    if (!gState.board[i][j].isShown && !gTimer) {
        gState.board[i][j].isShown = true
        createMines(gNumOfMines, gState.board)
        gState.board[i][j].isShown = false
    }

    gState.board[i][j].isShown = true
    renderCell(i, j, gState.board);
    revealNegs(i, j, gState.board)

    victory()

    if (gState.board[i][j].isMine) {
        elCell.innerHTML = gMine
        gState.lives--
        elCell.style.backgroundColor = 'red'
        renderLives(gState.lives)
        gameOver(gState.lives)
    }

    if (gState.board[i][j].minesAroundCount && !gState.board[i][j].isMine) {
        elCell.innerHTML = gState.board[i][j].minesAroundCount
    }

    if (!gTimer && !gState.board[i][j].isMine) {
        gFirstClickTime = new Date()
        intervalTimer = setInterval(timer, 1);
        gTimer = true
    }

}

function cellRightClicked(elCell, i, j) {
    gUndoState.push(JSON.stringify(gState));

    document.addEventListener('contextmenu',
        event => event.preventDefault());

    if (!gState.board[i][j].isMarked) {
        gState.board[i][j].isMarked = true
    } else {
        gState.board[i][j].isMarked = false
    }
    renderCell(i, j, gState.board);
    victory()

    if (!gTimer) {
        gFirstClickTime = new Date()
        intervalTimer = setInterval(timer, 1);
        gTimer = true
    }

}

function renderLives() {
    const LIVE_IMG = '❤️'
    const elLives = document.querySelector('.Lives')
    elLives.innerHTML = `Number of lifes: `

    for (var i = 0; i < gState.lives; i++) {
        elLives.innerHTML += `${LIVE_IMG}`
    }
}




