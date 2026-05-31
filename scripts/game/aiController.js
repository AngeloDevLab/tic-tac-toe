import { gameState } from "../state.js";
import { getClassicAiMove } from "./gamemodes/classicAi.js";
import { getUltimateAiMove } from "./gamemodes/ultimateAi.js";


/**
 * Returns whether it is currently the AI's turn.
 *
 * @returns {boolean}
 */
export function isAiTurn() {
    return gameState.matchType === "singleplayer" &&
        gameState.currentPlayer === "circle" &&
        !gameState.gameOver;
}


/**
 * Returns the AI's chosen move for the current game mode.
 * Classic mode returns a cell index; Ultimate mode returns { boardIndex, cellIndex }.
 *
 * @returns {number|{boardIndex: number, cellIndex: number}|null}
 */
export function getAiMove() {
    if (gameState.gameMode === "ultimate") return getUltimateAiMove();
    return getClassicAiMove();
}
