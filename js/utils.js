'use strict'

function createMat(ROWS, COLS) {
    var mat = []
    for (var i = 0; i < ROWS; i++) {
        var row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function buildBoard(board) {
    gUndoState = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isSafeClick: false,
                index: 0,
            }
        }

    }

    return board
}


function renderBoard(board, selector) {

    var strHTML = '<table border="0"><tbody>'
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td class="cell cell-${i}-${j}" onclick="cellClicked(this, ${i},${j})" `
            strHTML += `oncontextmenu="cellRightClicked(this, ${i},${j})"> `
            strHTML += `</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            renderCell(i, j, board)
        }
    }

    renderBestScore()
}

function renderCell(i, j, board) {
    var cell = board[i][j];
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    if (cell.isShown) {
        if (cell.isHint) {
            elCell.style.backgroundColor = 'rgb(233, 214, 111)'
        }
        else {
            elCell.style.backgroundColor = 'rgb(187, 187, 187)'
        }
        if (board[i][j].minesAroundCount) {
            elCell.innerHTML = board[i][j].minesAroundCount
        }
        else if (board[i][j].isMine) {
            elCell.innerHTML = gMine
        }
        else {
            elCell.innerHTML = ''
        }
    }
    else {
        elCell.innerHTML = ''
        if (cell.isSafeClick) {
            elCell.style.backgroundColor = 'rgb(56, 148, 197)'
        }
        else if (cell.isMarked) {
            elCell.innerHTML = gFlag
        }
        else {
            elCell.style.backgroundColor = 'gray'
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}

function timer() {

    var now = new Date()
    time = now - gFirstClickTime
    var elTimer = document.querySelector(`.timer`)
    elTimer.innerHTML = `GAME TIME: ${Math.round(time / 1000, 1)}`
}

