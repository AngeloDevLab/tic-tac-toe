//==================================================
// GAME.JS
//==================================================
// Core game logic and gameplay flow.
//
// Responsibilities:
// - Handle player moves
// - Switch turns
// - Validate moves
// - Check win and draw conditions
// - Restart and reset gameplay
//
// No direct DOM rendering here.
//==================================================
import { gameState, SCREENS } from "./state.js";
import { render, startLoadingTransition, navigateTo } from "./render.js";

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

export function selectGameMode(mode) {
    gameState.gameMode = mode;
    render();
}

export function selectMatchType(type) {
    gameState.matchType = type;
    render();
}

export function canStartGame() {
    return Boolean(gameState.gameMode && gameState.matchType);
}

export function startGameFlow() {
    if (!canStartGame()) return;

    restartGameState();
    startLoadingTransition({
        targetScreen: SCREENS.GAME,
        loadingScreen: SCREENS.LOADING_GAME,
        duration: 1400
    });
}

export function goBackToSetup() {
    restartGameState();
    navigateTo(SCREENS.SETUP);
}

export function handleCellClick(index) {
    if (gameState.gameOver) return;
    if (gameState.fields[index] !== null) return;

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

    render();
}

function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === "cross" ? "circle" : "cross";
}

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

function isBoardFull() {
    return gameState.fields.every((field) => field !== null);
}

function restartGameState() {
    gameState.fields = Array(9).fill(null);
    gameState.currentPlayer = "cross";
    gameState.winner = null;
    gameState.winningCombination = null;
    gameState.isDraw = false;
    gameState.gameOver = false;
}

export function restartGame() {
    restartGameState();
    render();
}