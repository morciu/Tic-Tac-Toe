const DomElements = (function() {
    // Reset game
    const resetGame = document.querySelector('#vsSmartAI');
    resetGame.addEventListener('click', () => {
        Game.setCurrentGameMode('smart ai');
        Game.startGame(Game.getCurrentGameMode());
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
        gameBoard = [
            null, null, null,
            null, null, null,
            null, null, null
        ]
        availableMoves = 9;

        // Reset colors from previous game's winning move
        for (let i = 0; i < elements.length; i++) {
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
                return {won: true, move: winConditions[i]};
            }
        }
        return false;
    }

    function clearInputs() {
        inputs.splice(0, inputs.length)
    }

    function showInputs() { return inputs }

    return {clearInputs, makeMove, checkIfWon, showInputs };
}

const RandomAIPlayer = function(mark) {
    const inputs = [];

    // Inherit from Player object
    const {checkIfWon} = Player(mark);

    // Make random move
    const makeMove = (board, index) => {
        let availableMoves = GameBoard.getFreeIndex();
        let randomMove = Math.floor(Math.random() * availableMoves.length);
        board[availableMoves[randomMove]] = mark;
        inputs.push(availableMoves[randomMove]);
        GameBoard.displayBoard();
        GameBoard.decreaseAvailableMoves();
    }

    function showInputs() { return inputs }

    function clearInputs() {
        inputs.splice(0, inputs.length)
    }

    return { clearInputs, makeMove, checkIfWon, showInputs };
}

const SmartAIPlayer = function(mark) {
    const inputs = [];

    // Inherit from Player object
    const { checkIfWon } = Player(mark);

    function clearInputs() {
        inputs.splice(0, inputs.length)
    }

    // Find best move
    function findBestMove() {
        let totalInputs = Game.totalInputs();
        let availableMoves = GameBoard.getFreeIndex();
        let bestValue = Infinity;
        let bestMoveIndex;
        for (let i = 0; i < availableMoves.length; i++) {
            
            // Push index to inputs
            inputs.push(availableMoves[i]);
            
            let moveValue = Game.minimax(totalInputs, 0, true);

            // Remove last input
            inputs.pop();

            // Get the lowest possible score
            if (moveValue < bestValue) {
                bestValue = moveValue;
                bestMoveIndex = availableMoves[i];
            }
        }
        return bestMoveIndex;
    }

    // Make move
    const makeMove = (board, index) => {
        let availableMoves = GameBoard.getFreeIndex();
        let bestMove = findBestMove();

        inputs.push(bestMove);
        board[bestMove] = mark;
        GameBoard.displayBoard();
        GameBoard.decreaseAvailableMoves();
    }

    function showInputs() { return inputs }

    return { clearInputs, makeMove, checkIfWon, showInputs };
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
        } else if (currentGameMode === 'dumb ai') {
            player2 = RandomAIPlayer('O');
        } else if (currentGameMode === 'smart ai') {
            player2 = SmartAIPlayer('O');
        }
        player1.clearInputs();
        player2.clearInputs();
        currentPlayer = player1;
        DomElements.showCurrentPlayer(1);
    }

    function gameTurn(board, index, mode) {
        if (mode === 'multiplayer') {
            if (!checkGameOver()) {
                // Store current player mark
                currentPlayer.makeMove(board, index);
                GameBoard.displayBoard();
                if (currentPlayer.checkIfWon(currentPlayer.showInputs()).won) {
                    GameBoard.showWinningMove(currentPlayer.checkIfWon(currentPlayer.showInputs()).move);
                    setCurrentGameMode(null);
                }
                else {
                    // switch players
                    currentPlayer = switchPlayer()
                }
            }
        } else if (mode === 'dumb ai' || mode === 'smart ai') {
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
                            GameBoard.showWinningMove(currentPlayer.checkIfWon(currentPlayer.showInputs()).move);
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

    // Evaluate state of the board
    function evalGame(totalInputs) {
        if (player1.checkIfWon(totalInputs.p1)) {
            return 1;
        }
        else if (player2.checkIfWon(totalInputs.p2)) {
            return -1;
        }
        else {
            return 0;
        }
    }

    // Minimax
    function minimax(totalInputs, depth, max) {
        let moves = Object.assign({}, totalInputs);
        let score = evalGame(moves);
        let totalPlayerMoves = totalInputs.p1.concat(totalInputs.p2);

        // Return evaluated score for maximezer or minimizer or for a tied game
        if (score === 1) {
            return score;
        }
        if (score === -1) {
            return score;
        }
        if (totalPlayerMoves.length >= 9) {
            return 0;
        }

        // Maximizer's move
        if (max === true) {
            let bestScore = -1000;

            // Make all possible moves
            for (let i = 0; i < 9; i++) {
                if (!totalPlayerMoves.includes(i)) {
                    moves.p1.push(i);
                    let moveScore = minimax(moves, depth + 1, false);
                    bestScore = Math.max(bestScore, moveScore);
                    moves.p1.pop();
                }
            }
            return bestScore;
        }
        // Minimizer's move
        else if (max === false) {
            let bestScore = 1000;

            // Make all possible moves
            for (let i = 0; i < 9; i++) {
                if (!totalPlayerMoves.includes(i)) {
                    moves.p2.push(i);
                    let moveScore = minimax(moves, depth + 1, true);
                    bestScore = Math.min(bestScore, moveScore);
                    moves.p2.pop();
                }
            }
            return bestScore;
        }
    }

    function totalInputs() {
        return {
            p1: player1.showInputs(),
            p2: player2.showInputs()
        }
    }

    return { evalGame, startGame, getCurrentGameMode, setCurrentGameMode, advanceGame, minimax, totalInputs }
})()