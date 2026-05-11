//==================================================
// STATE.JS
//==================================================
// Central game state management.
// Stores all game data and current game status.
//
// Responsibilities:
// - Store board data
// - Store current player
// - Store active game mode
// - Store game status and winner
// - Provide the single source of truth
//
// No rendering or DOM manipulation here.
//==================================================

export let gameState = {
    currentScreen: "landing",
    gameMode: null, // "classic" | "ultimate"
    matchType: null, // "singleplayer" | "local" | "online"
    currentPlayer: "cross",
    fields: Array(9).fill(null),
    winner: null, // cross | circle
    winningCombination: null,
    gameOver: false
};