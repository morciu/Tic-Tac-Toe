const GameBoard = (function() {
    let gameBoard = [
        null, null, null,
        null, null, null,
        null, null, null
    ]

    const displayBoard = () => {
        let spaceElements = document.querySelectorAll('.space');
        for (let i = 0; i<spaceElements.length; i++) {
            spaceElements[i].innerText = gameBoard[i];
        }
    }

    const resetBoard = () => {
        gameBoard = [
            null, null, null,
            null, null, null,
            null, null, null
        ]
        displayBoard()
    }

    const placeOnBoard = (mark, position) => {
        gameBoard[position] = mark;
        displayBoard()
    }

    return {displayBoard, resetBoard, placeOnBoard};
})()

const Player = function() {
    const placeMove = function(position) {
        GameBoard.placeOnBoard('x', position);
    }

    return { placeMove }
}