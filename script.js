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
            if (Game.currentGameMode !== null) {
                gameBoard[i] = Game.currentGameMode.playerMove();
                displayBoard()
            }
        })
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
   const makeMove = () => {
       return mark;
   }
   return { makeMove };
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
    const playerMove = () => {
        // Store current player mark
        let playerMark = currentPlayer.makeMove();

        // switch players
        if (currentPlayer === p1) {
            currentPlayer = p2;
        } else if (currentPlayer === p2) {
            currentPlayer = p1;
        }

        return playerMark;
    }
 
    return { playerMove }
}

const Game = (function() {
    // Game modes
    let currentGameMode = null;

    return { currentGameMode }
})()