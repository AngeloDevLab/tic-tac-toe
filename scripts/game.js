import { gameState, SCREENS } from "./state.js";
import { render, startLoadingTransition, navigateTo } from "./render.js";


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
    startLoadingTransition({
        targetScreen: SCREENS.GAME,
        duration: 1800,
        label: "Starting Game"
    });
}


/**
 * Resets the current game
 * and navigates back to the setup screen.
 */
export function goBackToSetup() {
    resetGameState();
    navigateTo(SCREENS.SETUP);
}


/**
 * Handles a player move
 * when a board cell is clicked.
 *
 * Updates:
 * - player fields
 * - winner state
 * - draw state
 * - active player
 *
 * @param {number} index - Index of the clicked cell.
 */
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
    gameState.currentPlayer = "cross";
    gameState.winner = null;
    gameState.winningCombination = null;
    gameState.isDraw = false;
    gameState.gameOver = false;
}


/**
 * Restarts the game
 * and rerenders the UI.
 */
export function restartGame() {
    resetGameState();
    render();
}