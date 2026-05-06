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