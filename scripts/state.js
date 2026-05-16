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
export const SCREENS = {
    LOADING_INITIAL: "loading-initial",
    SETUP: "setup",
    LOADING_GAME: "loading-game",
    GAME: "game"
};

export let gameState = {
    currentScreen: SCREENS.LOADING_INITIAL,
    gameMode: null, // "classic" | "ultimate"
    matchType: null, // "singleplayer" | "local" | "online"
    currentPlayer: "cross",
    fields: Array(9).fill(null),
    winner: null, // cross | circle
    winningCombination: null,
    isDraw: false,
    gameOver: false,
    loadingProgress: 0,
    loadingLabel: "Loading"
};