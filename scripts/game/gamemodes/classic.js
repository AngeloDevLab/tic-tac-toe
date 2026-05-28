import { gameState } from "../../state.js";
import { winningCombinations } from "../winConditions.js";


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
