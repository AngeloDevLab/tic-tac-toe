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
    },
    starterSelection: {
        visible: false,
        player: null,
        spinning: false,
        confirmed: false
    },
};

export let gameState = {
    gameMode: "classic",
    matchType: "singleplayer",
    difficulty: "easy",

    players: [
        {
            name: "",
            symbol: "cross"
        },
        {
            name: "",
            symbol: "circle"
        }
    ],
    starterPlayer: null,
    currentPlayer: null,

    fields: Array(9).fill(null),

    winner: null,
    winningCombination: null,

    isDraw: false,
    gameOver: false,
};