'use strict'


function createMines(nums, board) {
    var minesPlaced = 0;
    while (minesPlaced < nums) {
        var randomI = getRandomInt(0, board.length - 1)
        var randomJ = getRandomInt(0, board[0].length - 1)

        if (!board[randomI][randomJ].isShown &&
            !board[randomI][randomJ].isMine) {
            board[randomI][randomJ].isMine = true
            board[randomI][randomJ].minesAroundCount = 0
            setMinesNegsCount(randomI, randomJ, board)
            const elCell = document.querySelector(`.cell-${randomI}-${randomJ}`)
            minesPlaced++;
        }
    }
}

function setMinesNegsCount(cellI, cellJ, mat) {

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;
            if (mat[i][j].isMine === false) {
                mat[i][j].minesAroundCount++
            }
        }
    }
}

function revealNegs(cellI, cellJ, mat) {
    if (mat[cellI][cellJ].minesAroundCount) return

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue;
            if (j < 0 || j >= mat[i].length) continue;

            var recurse = mat[i][j].isMine === false &&
                mat[i][j].minesAroundCount == 0 &&
                mat[i][j].isShown == false;

            if (mat[i][j].isMine === false) {
                mat[i][j].isShown = true

                renderCell(i, j, mat)
            }

            if (recurse) {
                revealNegs(i, j, mat)
            }
        }
    }
}
