const DomElements = (function() {
    const startVsAI = document.querySelector('#vsAI');
    startVsAI.addEventListener('click', () => {
        Game.currentGameMode = Singleplayer();
    })

    const startVsHuman = document.querySelector('#vsHuman');
    startVsHuman.addEventListener('click', () => {
        Game.currentGameMode = Multiplayer()
    })
    const spaces = document.querySelectorAll('.space');
    return { startVsAI, startVsHuman, spaces }
})()

const GameBoard = (function() {
    let gameBoard = [
        null, null, null,
        null, null, null,
        null, null, null
    ]
    const elements = DomElements.spaces;

    // add events for player moves
    for (let i=0; i< elements.length; i++) {
        elements[i].addEventListener('click', () =>{
            _addEvent(i);
        })
    }

    function _addEvent(spaceIndex) {
        // adds events to the game spaces
        if (Game.currentGameMode !== null) {
            gameBoard[spaceIndex] = Game.currentGameMode.playerMove(spaceIndex);
            displayBoard();
        }
    }

    let availableMoves = 9;

    let isPlayable = () => {
        return availableMoves > 0 ? true : false;
    }

    const displayBoard = () => {
        for (let i = 0; i<elements.length; i++) {
            elements[i].innerText = gameBoard[i];
        }
    }

    const resetBoard = () => {
        gameBoard = [
            null, null, null,
            null, null, null,
            null, null, null
        ]
        availableMoves = 9;
        displayBoard()
    }

    const getMove = (mark) => {
        return mark;
    }

    return {displayBoard, resetBoard, isPlayable, getMove};
})()

const Player = function(mark) {
    let inputs = [];

    const makeMove = (index) => {
        inputs.push(index);
        return mark;
    }
    return { makeMove, inputs };
}

const Singleplayer = (function() {
    console.log('started single player');
    GameBoard.resetBoard();
})

const Multiplayer = function() {
    console.log("Started multiplayer")
    GameBoard.resetBoard();

    // Set up players
    const p1 = Player('X');
    const p2 = Player('O');
    let currentPlayer = p1;

    // Get player move
    const playerMove = (index) => {
        // Store current player mark
        let playerMark = currentPlayer.makeMove(index);

        // switch players
        if (currentPlayer === p1) {
            currentPlayer = p2;
        } else if (currentPlayer === p2) {
            currentPlayer = p1;
        }

        return playerMark;
    }
 
    return { playerMove, currentPlayer }
}

const Game = (function() {
    // Game modes
    let currentGameMode = null;

    function checkIfWon(inputList) {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        if (inputList.length > 3) {
            return false;
        } else {
            for (let i=0; i<winConditions.length; i++) {
                let found = 0
                for (let j=0; j<3; j++) {
                    if (inputList.includes(winConditions[i][j])) {
                        found++;
                    }
                }
                if (found === 3) {
                    return true;
                }
            }
        }
        return false;
    }

    return { currentGameMode, checkIfWon}
})()