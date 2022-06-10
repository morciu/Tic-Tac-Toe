const DomElements = (function() {
    // Reset game
    const resetGame = document.querySelector('#vsSmartAI');
    resetGame.addEventListener('click', () => {
        console.log("Smart AI")
    });

    // Start a game vs AI
    const startVsDumbAI = document.querySelector('#vsDumbAI');
    startVsDumbAI.addEventListener('click', () => {
        Game.setCurrentGameMode('dumb ai');
        Game.startGame(Game.getCurrentGameMode());
    })

    // Start a game vs another human
    const startVsHuman = document.querySelector('#vsHuman');
    startVsHuman.addEventListener('click', () => {
        Game.setCurrentGameMode('multiplayer');
        Game.startGame(Game.getCurrentGameMode());
    })

    // Get all free spaces
    const spaces = document.querySelectorAll('.space');

    // Current player indicators
    const player1 = document.querySelector("#p1");
    const player2 = document.querySelector("#p2");

    // Color current player
    const showCurrentPlayer = (player) => {
        if (player === 1) {
            player1.classList.add("currentPlayer");
            player2.classList.remove("currentPlayer");
        } else if (player === 2) {
            player2.classList.add("currentPlayer");
            player1.classList.remove("currentPlayer");
        }
    }

    const showGridSpaces = () => {
        return spaces;
    }

    return { showGridSpaces, showCurrentPlayer }
})()

const GameBoard = (function() {
    let gameBoard = [
        null, null, null,
        null, null, null,
        null, null, null
    ]
    const elements = DomElements.showGridSpaces();

    // add events for player moves
    for (let i=0; i< elements.length; i++) {
        elements[i].addEventListener('click', () =>{
            Game.advanceGame(gameBoard, i, Game.getCurrentGameMode());
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
        console.log("resetting")
        gameBoard = [
            null, null, null,
            null, null, null,
            null, null, null
        ]
        availableMoves = 9;

        // Reset colors from previous game's winning move
        for (let i = 0; i < elements.length; i++) {
            console.log("removing colors")
            elements[i].classList.remove("winningMove");
        }
        displayBoard()
    }

    function getFreeIndex() {
        freeIndex = []
        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === null) {
                freeIndex.push(i);
            }
        }
        return freeIndex;
    }

    function decreaseAvailableMoves() {
        availableMoves--;
    }

    const getMove = (mark) => {
        return mark;
    }

    const showWinningMove = (winningMove) => {
        for (let i = 0; i < winningMove.length; i++) {
            DomElements.showGridSpaces()[winningMove[i]].classList.add("winningMove");
        }
    }

    return {displayBoard, resetBoard, isPlayable, getMove, getFreeIndex, showWinningMove, decreaseAvailableMoves };
})()

const Player = function(mark) {
    const inputs = [];

    const makeMove = (board, index) => {
        board[index] = mark;
        inputs.push(index)
        GameBoard.decreaseAvailableMoves()
        GameBoard.displayBoard();
    }

    const checkIfWon = (inputs) =>  {
        console.log("CHECKING! " + mark)
        console.log(inputs)
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]
        for (let i=0; i<winConditions.length; i++) {
            let found = 0;
            for (let j=0; j<3; j++) {
                if (inputs.includes(winConditions[i][j])) {
                    found++;
                }
            }
            if (found === 3) {
                GameBoard.showWinningMove(winConditions[i]);
                inputs.splice(0, inputs.length);
                return true;
            }
        }
        return false;
    }

    function showInputs() { return inputs }

    return { makeMove, checkIfWon, showInputs };
}

const RandomAIPlayer = function(mark) {
    const inputs = [];

    // Inherit from Player object
    const {checkIfWon} = Player(mark);

    // Make random moves
    const makeMove = (board, index) => {
        let availableMoves = GameBoard.getFreeIndex();
        let randomMove = Math.floor(Math.random() * availableMoves.length);
        board[availableMoves[randomMove]] = mark;
        inputs.push(availableMoves[randomMove]);
        GameBoard.displayBoard();
        GameBoard.decreaseAvailableMoves();
        console.log(mark + " inputs: " + inputs)
    }

    function showInputs() { return inputs }

    return { makeMove, checkIfWon, showInputs };
}

const Game = (function() {
    // Game modes
    let currentGameMode = null;

    let player1 = Player('X');
    let player2 = null;
    let currentPlayer = null;

    function startGame(mode) {
        GameBoard.resetBoard();
        
        if (mode === "multiplayer") {
            player2 = Player('O');
            currentPlayer = player1;
            DomElements.showCurrentPlayer(1);
        } else if (currentGameMode = 'dumb ai') {
            player2 = RandomAIPlayer('O');
            currentPlayer = player1;
            DomElements.showCurrentPlayer(1);
        }
    }

    function gameTurn(board, index, mode) {
        if (mode === 'multiplayer') {
            if (!checkGameOver()) {
                // Store current player mark
                currentPlayer.makeMove(board, index);
                GameBoard.displayBoard();
                if (currentPlayer.checkIfWon(currentPlayer.showInputs())) {
                    setCurrentGameMode(null);
                }
                else {
                    // switch players
                    currentPlayer = switchPlayer()
                }
            }
        } else if (mode === 'dumb ai') {
            if (!checkGameOver()) {
                // Human Turn
                currentPlayer.makeMove(board, index);
                if (currentPlayer.checkIfWon(currentPlayer.showInputs())) {
                    setCurrentGameMode(null);
                } else {
                    currentPlayer = player2;
                    DomElements.showCurrentPlayer(2);
                    
                    // AI Turn
                    setTimeout(() => {
                        currentPlayer.makeMove(board, index);
                        if (currentPlayer.checkIfWon(currentPlayer.showInputs())) {
                            setCurrentGameMode(null);
                        } else {
                            currentPlayer = player1;
                            DomElements.showCurrentPlayer(1);
                        }
                    }, 1000);
                }
            }
        }
    }

    function switchPlayer() {
        if (currentPlayer === player1) {
            currentPlayer = player2;
            DomElements.showCurrentPlayer(2);
        } else if (currentPlayer === player2) {
            currentPlayer = player1;
            DomElements.showCurrentPlayer(1);
        }
        return currentPlayer;
    }

    function checkGameOver() {
        if (!GameBoard.isPlayable()) {
            currentGameMode = null;
            return true;
        }
        return false;
    }

    function getCurrentGameMode() {
        return currentGameMode;
    }

    function setCurrentGameMode(mode) {
        currentGameMode = mode;
    }

    function advanceGame(board, moveIndex, mode) {
        if (currentGameMode !== null && board[moveIndex] === null) {
            gameTurn(board, moveIndex, mode);
        }
    }

    return { startGame, getCurrentGameMode, setCurrentGameMode, advanceGame }
})()