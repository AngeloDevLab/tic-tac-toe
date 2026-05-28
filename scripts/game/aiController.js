import { gameState } from "../state.js";
import { getClassicAiMove } from "./gamemodes/classicAi.js";
import { getUltimateAiMove } from "./gamemodes/ultimateAi.js";


export function isAiTurn() {
    return gameState.matchType === "singleplayer" &&
        gameState.currentPlayer === "circle" &&
        !gameState.gameOver;
}


export function getAiMove() {
    if (gameState.gameMode === "ultimate") return getUltimateAiMove();
    return getClassicAiMove();
}
