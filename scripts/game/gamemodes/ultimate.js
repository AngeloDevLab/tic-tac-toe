import { gameState } from "../../state.js";
import { winningCombinations } from "../winConditions.js";


export function initUltimateState() {
    gameState.ultimateBoards = Array(9).fill(null).map(() => Array(9).fill(null));
    gameState.ultimateBoardWinners = Array(9).fill(null);
    gameState.activeBoardIndex = null;
}


export function isUltimateBoardPlayable(boardIndex) {
    if (gameState.ultimateBoardWinners[boardIndex] !== null) return false;
    if (gameState.activeBoardIndex === null) return true;
    return gameState.activeBoardIndex === boardIndex;
}


export function placeUltimateMove(boardIndex, cellIndex) {
    gameState.ultimateBoards[boardIndex][cellIndex] = gameState.currentPlayer;

    checkMiniBoardWinner(boardIndex);
    checkGlobalWinner();

    if (!gameState.gameOver) {
        const nextBoard = cellIndex;
        gameState.activeBoardIndex = gameState.ultimateBoardWinners[nextBoard] !== null
            ? null
            : nextBoard;

        gameState.currentPlayer = gameState.currentPlayer === "cross" ? "circle" : "cross";
    } else {
        gameState.activeBoardIndex = null;
    }
}


function checkMiniBoardWinner(boardIndex) {
    const board = gameState.ultimateBoards[boardIndex];

    for (const [a, b, c] of winningCombinations) {
        const first = board[a];
        if (first !== null && first === board[b] && first === board[c]) {
            gameState.ultimateBoardWinners[boardIndex] = first;
            return;
        }
    }

    if (board.every(cell => cell !== null)) {
        gameState.ultimateBoardWinners[boardIndex] = "draw";
    }
}


function checkGlobalWinner() {
    const winners = gameState.ultimateBoardWinners;

    for (const [a, b, c] of winningCombinations) {
        const first = winners[a];
        if (first && first !== "draw" && first === winners[b] && first === winners[c]) {
            gameState.winner = first;
            gameState.winningCombination = [a, b, c];
            gameState.gameOver = true;
            return;
        }
    }

    if (winners.every(w => w !== null)) {
        gameState.isDraw = true;
        gameState.gameOver = true;
    }
}
