export const SCREENS = {
    SETUP: "setup",
    LOADING: "loading",
    GAME: "game"
};

export const SUPPORTED_LANGUAGES = {
    DE: "de",
    EN: "en"
};

export let appState = {
    language: SUPPORTED_LANGUAGES.EN,
    currentScreen: SCREENS.LOADING,
    loading: {
        progress: 0,
        label: "Loading"
    }
};

export let gameState = {
    gameMode: null,
    matchType: null,

    player: [],
    starterPlayer: null,
    currentPlayer: "cross",

    fields: Array(9).fill(null),

    winner: null,
    winningCombination: null,
    
    isDraw: false,
    gameOver: false,
};