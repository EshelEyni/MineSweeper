'use strict'

function hint(elHint, idx) {
    elHint.style.backgroundColor = 'yellow'
    gHint = true
    hintsIdx = idx
}

function renderHints() {
    const elHints = document.querySelectorAll('.hints span')
    for (var i = 0; i < elHints.length; i++) {
        elHints[i].innerHTML = `💡`

    }
}

function revealByHint(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isShown === false) {
                mat[i][j].isShown = true
                mat[i][j].isHint = true
                renderCell(i, j, gState.board)
            }
        }
    }
}

function hideHint(cellI, cellJ, mat) {
    gHint = false
    const elHints = document.querySelectorAll('.hints span')
    elHints[hintsIdx].style.display = 'none'

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isHint === true) {
                mat[i][j].isShown = false
                mat[i][j].isHint = false
                renderCell(i, j, gState.board)
            }

        }
    }

}


function safeClick() {
    if (!gNumsSafeClick) return

    gNumsSafeClick--

    var safeClickArr = []
    var safeCell
    for (var i = 0; i < gState.board.length; i++) {
        for (var j = 0; j < gState.board[i].length; j++) {
            if (!gState.board[i][j].isMine && !gState.board[i][j].isShown) {
                safeClickArr.push({ i, j })
            }
        }
    }

    if (!safeClickArr.length) return

    safeCell = safeClickArr[getRandomInt(0, safeClickArr.length - 1)]
    gState.board[safeCell.i][safeCell.j].isSafeClick = true
    renderCell(safeCell.i, safeCell.j, gState.board)

    renderNumsSafeClick()
    setTimeout(hideSafeClick, 3000, safeCell.i, safeCell.j)

}

function renderNumsSafeClick() {
    if (gNumsSafeClick >= 0) {
        const elNumsSafeClick = document.querySelector('.safeclickText')
        elNumsSafeClick.innerHTML = `${gNumsSafeClick}`
    }
}

function hideSafeClick(i, j) {
    gState.board[i][j].isSafeClick = false;
    renderCell(i, j, gState.board)
}


function setManuallMode() {
    gMinesManuallMode = true
    console.log('hi')
}


function sevenBoom() {
    var index = 0
    clearInterval(intervalTimer)
    gTimer = false
    const timer = document.querySelector('.timer')
    timer.style.display = 'none'
    const gameOver = document.querySelector('.gameover')
    gameOver.style.display = 'none'
    gState.board = buildBoard(createMat(gBoardSqrt, gBoardSqrt))
    renderBoard(gState.board, '.board')
    renderLives(3)
    gNumOfMines = gNumOfMines

    for (var i = 0; i < gState.board.length; i++) {
        for (var j = 0; j < gState.board[i].length; j++) {
            gState.board[i][j].index = index
            index++

        }
    }

    for (var i = 0; i < gState.board.length; i++) {
        for (var j = 0; j < gState.board[i].length; j++) {
            if (gState.board[i][j].index % 7 === 0 && !(gState.board[i][j].index === 0)) {
                gState.board[i][j].isMine = true
            }

        }
    }

    for (var i = 0; i < gState.board.length; i++) {
        for (var j = 0; j < gState.board[i].length; j++) {
            var strIndex = '' + gState.board[i][j].index
            for (var x = 0; x < strIndex.length; x++) {
                var checkDigit = strIndex.charAt(x)
                if (checkDigit == 7) {
                    gState.board[i][j].isMine = true
                }
            }

        }
    }
}

function bestScore() {
    var bestScore
    var key = 'BestScoreLevel=' + gBoardSqrt;

    if (time < prevTime) {
        bestScore = time / 1000
    } else {
        bestScore = prevTime / 1000
    }

    var old = window.localStorage.getItem(key);
    if (old != null && parseFloat(old) < bestScore)
        return;

    window.localStorage.setItem(key, bestScore);


}

function renderBestScore() {
    var key = 'BestScoreLevel=' + gBoardSqrt;
    var old = window.localStorage.getItem(key);
    const elBestScore = document.querySelector('.bestscore')
    if (old === null) {
        elBestScore.innerHTML = `BEST SCORE: 00:00`
        return
    }
    elBestScore.innerHTML = `BEST SCORE: ${old}`
}


function undo() {
    if (gUndoState.length === 0) {
        return
    }
    var state = gUndoState.pop();
    gState = JSON.parse(state);
    render()
}

