import { gameState } from "../state.js";

export const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

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

export function isBoardFull() {
    return gameState.fields.every(f => f !== null);
}

function switchPlayer() {
    gameState.currentPlayer = gameState.currentPlayer === "cross" ? "circle" : "cross";
}
