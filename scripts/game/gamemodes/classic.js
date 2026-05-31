import { gameState } from "../../state.js";
import { winningCombinations } from "../winConditions.js";


/**
 * Places the current player's move at the given index,
 * then checks for a winner or draw and switches the player.
 *
 * @param {number} index - Cell index (0–8).
 */
export function placeMove(index) {
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
 * Checks all winning combinations against the current board.
 * Sets winner, winningCombination and gameOver on a match.
 */
export function checkWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        const first = gameState.fields[a];
        const second = gameState.fields[b];
        const third = gameState.fields[c];

        if (first !== null && first === second && first === third) {
            gameState.winner = first;
            gameState.winningCombination = combination;
            gameState.gameOver = true;
            return;
        }
    }
}


/**
 * Returns whether all cells on the board are filled.
 *
 * @returns {boolean}
 */
export function isBoardFull() {
    return gameState.fields.every(f => f !== null);
}


function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === "cross" ? "circle" : "cross";
}
