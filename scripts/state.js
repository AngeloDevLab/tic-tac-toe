export const SCREENS = {
    SETUP: "setup",
    LOADING: "loading",
    GAME: "game"
};

export let gameState = {
    currentScreen: SCREENS.LOADING,
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