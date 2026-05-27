import {
    appState,
    gameState,
    SCREENS
} from "../state.js";

import {
    render,
    startLoadingTransition,
    navigateTo
} from "../render/render.js";

import {
    createPlayerName
} from "./players.js";

import {
    translate
} from "../i18n/translate.js";


const STARTER_ANIMATION_TIME = 2500;


/**
 * All possible winning
 * combinations for the board.
 */
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


/**
 * Sets the selected game mode
 * and rerenders the UI.
 */
export function selectGameMode(mode) {
    gameState.gameMode = mode;
    render();
}


/**
 * Sets the selected match type
 * and rerenders the UI.
 */
export function selectMatchType(type) {
    gameState.matchType = type;
    render();
}


/**
 * Sets the selected difficulty
 * and rerenders the UI.
 */
export function selectDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    render();
}


/**
 * Checks whether the game
 * can be started.
 *
 * @returns {boolean} True if
 * game mode and match type
 * are selected.
 */
export function canStartGame() {
    return Boolean(gameState.gameMode && gameState.matchType);
}


/**
 * Starts the game
 * and triggers the loading transition.
 */
export function startGame() {
    if (!canStartGame()) return;
    resetGameState();
    initializePlayerNames();
    startLoadingTransition({
        targetScreen: SCREENS.GAME,
        duration: 1800,
        label: "loading.startGame"
    });

    window.setTimeout(
        chooseStarter,
        1800
    );
}


/**
 * Resets the current game
 * and navigates back to the setup screen.
 */
export function goBackToSetup() {
    resetPlayerState();
    resetGameState();
    navigateTo(SCREENS.SETUP);
}


/**
 * Handles a player move
 * when a board cell is clicked.
 *
 * @param {number} index - Index of the clicked cell.
 */
export function handleCellClick(index) {
    if (gameState.gameOver) return;
    if (gameState.fields[index] !== null) return;
    if (isAiTurn()) return;

    placeMove(index);
    render();

    if (!gameState.gameOver && isAiTurn()) {
        scheduleAiMove();
    }
}


/**
 * Triggers an AI move if it is the AI's turn.
 * Call this after the starter is confirmed.
 */
export function triggerAiMoveIfNeeded() {
    if (isAiTurn()) scheduleAiMove();
}


function isAiTurn() {
    return gameState.matchType === "singleplayer" &&
        gameState.currentPlayer === "circle" &&
        !gameState.gameOver;
}


function scheduleAiMove() {
    window.setTimeout(() => {
        const index = getAiMove();
        if (index === -1) return;
        placeMove(index);
        render();
    }, 600);
}


function getAiMove() {
    if (gameState.difficulty === "medium") return getMediumAiMove();
    if (gameState.difficulty === "hard") return getHardAiMove();
    return getEasyAiMove();
}


function getEasyAiMove() {
    const empty = gameState.fields
        .map((field, i) => field === null ? i : null)
        .filter(i => i !== null);

    if (empty.length === 0) return -1;
    return empty[Math.floor(Math.random() * empty.length)];
}


function getMediumAiMove() {
    const win = findWinningMove("circle");
    if (win !== -1) return win;

    const block = findWinningMove("cross");
    if (block !== -1) return block;

    return getEasyAiMove();
}


function getHardAiMove() {
    const fields = [...gameState.fields];
    let bestScore = -Infinity;
    let bestIndex = -1;

    for (let i = 0; i < fields.length; i++) {
        if (fields[i] !== null) continue;
        fields[i] = "circle";
        const score = minimax(fields, false);
        fields[i] = null;
        if (score > bestScore) {
            bestScore = score;
            bestIndex = i;
        }
    }
    return bestIndex;
}


function minimax(fields, isMaximizing) {
    const result = evaluateBoard(fields);
    if (result !== null) return result;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < fields.length; i++) {
            if (fields[i] !== null) continue;
            fields[i] = "circle";
            best = Math.max(best, minimax(fields, false));
            fields[i] = null;
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < fields.length; i++) {
            if (fields[i] !== null) continue;
            fields[i] = "cross";
            best = Math.min(best, minimax(fields, true));
            fields[i] = null;
        }
        return best;
    }
}


function evaluateBoard(fields) {
    for (const [a, b, c] of winningCombinations) {
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            return fields[a] === "circle" ? 10 : -10;
        }
    }
    if (fields.every(f => f !== null)) return 0;
    return null;
}


function findWinningMove(symbol) {
    for (const [a, b, c] of winningCombinations) {
        const fields = [gameState.fields[a], gameState.fields[b], gameState.fields[c]];
        const symbolCount = fields.filter(f => f === symbol).length;
        const emptyIndex = fields.indexOf(null);

        if (symbolCount === 2 && emptyIndex !== -1) {
            return [a, b, c][emptyIndex];
        }
    }
    return -1;
}


/**
 * Places a move for the current player,
 * checks win/draw, and switches the active player.
 *
 * @param {number} index - Board index to place the move.
 */
function placeMove(index) {
    gameState.fields[index] = gameState.currentPlayer;
    checkWinner();

    if (!gameState.gameOver) {
        if (isBoardFull()) {
            gameState.isDraw = true;
            gameState.gameOver = true;
        } else {
            switchPlayer();
        }
    }
}


/**
 * Switches the active player.
 */
function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === "cross" ? "circle" : "cross";
}


/**
 * Checks all winning combinations
 * and updates the game state
 * when a winner is found.
 */
function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        const firstField = gameState.fields[a];
        const secondField = gameState.fields[b];
        const thirdField = gameState.fields[c];

        if (firstField !== null && firstField === secondField && firstField === thirdField) {
            gameState.winner = firstField;
            gameState.winningCombination = combination;
            gameState.gameOver = true;
            return;
        }
    }
}


/**
 * Checks whether the game board is full.
 *
 * @returns {boolean} True if all fields are occupied.
 */
function isBoardFull() {
    return gameState.fields.every((field) => field !== null);
}


/**
 * Resets the game state
 * to its default values.
 */
function resetGameState() {
    gameState.fields = Array(9).fill(null);
    gameState.currentPlayer = null;
    gameState.winner = null;
    gameState.winningCombination = null;
    gameState.isDraw = false;
    gameState.gameOver = false;
}


/**
 * Resets player names and symbols
 * to their default values.
 */
export function resetPlayerState() {
    gameState.players = [
        {
            name: "",
            symbol: "cross"
        },
        {
            name: "",
            symbol: "circle"
        }
    ];
}


/**
 * Restarts the game
 * and rerenders the UI.
 */
export function restartGame() {
    const starter = determineStarter();
    resetGameState();
    chooseStarter(starter);
}


/**
 * Updates a player's display name.
 *
 * @param {string} playerId - Input identifier of the player.
 * @param {string} value - New player name value.
 */
export function updatePlayerName(playerId, value) {
    const index = playerId === "player-one" ? 0 : 1;
    gameState.players[index].name = createPlayerName(value, translate(`setup.player${index + 1}`));
}


/**
 * Initializes empty player names
 * with translated fallback values.
 */
function initializePlayerNames() {
    if (gameState.matchType === "singleplayer") {
        gameState.players[0].name = createPlayerName(
            gameState.players[0].name,
            translate("setup.you")
        );
        gameState.players[1].name =
            translate("setup.opponent") +
            " (" + translate(`setup.${gameState.difficulty}`) + ")";
    } else {
        gameState.players.forEach((player, index) => {
            player.name = createPlayerName(
                player.name,
                translate(index === 0 ? "setup.playerOne" : "setup.playerTwo")
            );
        });
    }
}

export function chooseStarter(player = null) {
    appState.starterSelection.visible = true;
    const starter =
        player ??
        (
            Math.random() > 0.5
                ? "cross"
                : "circle"
        );

    const isRandom = player === null;
    appState.starterSelection.spinning = isRandom;
    appState.starterSelection.player = isRandom ? null : starter;
    gameState.starterPlayer = starter;
    render();

    if (!isRandom)
        return;

    window.setTimeout(() => {
        appState.starterSelection.player = starter;
        appState.starterSelection.spinning = false;
        render();

    }, STARTER_ANIMATION_TIME);
}

function determineStarter() {
    if (gameState.isDraw) return null;

    return gameState.winner === "cross"
        ? "circle"
        : "cross";

}