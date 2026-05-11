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

import { gameState } from "./state.js";
import { render } from "./render.js";

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
    gameState.currentScreen = "match-type";
    render();
}

export function selectMatchType(type) {
    gameState.matchType = type;
    gameState.currentScreen = "game";
    render();
}

export function handleCellClick(index) {
    if (gameState.gameOver) return;
    if (gameState.fields[index] !== null) return;
    gameState.fields[index] = gameState.currentPlayer;
    checkWinner();

    if (!gameState.gameOver) {
        switchPlayer();
    }

    render();
}

function switchPlayer() {
    if (gameState.currentPlayer === "cross") {
        gameState.currentPlayer = "circle";

        return;
    }

    gameState.currentPlayer = "cross";
}

function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;

        const firstField = gameState.fields[a];
        const secondField = gameState.fields[b];
        const thirdField = gameState.fields[c];

        if (
            firstField !== null &&
            firstField === secondField &&
            firstField === thirdField
        ) {
            gameState.winner = firstField;
            gameState.winningCombination = combination;
            gameState.gameOver = true;

            return;
        }
    }
}

export function restartGame() {
    gameState.fields = Array(9).fill(null);
    gameState.currentPlayer = "cross";
    gameState.winner = null;
    gameState.winningCombination = null;
    gameState.gameOver = false;
    
    render();
}