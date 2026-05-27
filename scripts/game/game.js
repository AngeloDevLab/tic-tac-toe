import { appState, gameState, SCREENS } from "../state.js";
import { render, startLoadingTransition, navigateTo } from "../render/render.js";
import { createPlayerName } from "./players.js";
import { translate } from "../i18n/translate.js";
import { placeMove } from "./board.js";
import { isAiTurn, getAiMove } from "./ai.js";


const STARTER_ANIMATION_TIME = 2500;


export function selectGameMode(mode) {
    gameState.gameMode = mode;
    render();
}


export function selectMatchType(type) {
    gameState.matchType = type;
    render();
}


export function selectDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    render();
}


export function canStartGame() {
    return Boolean(gameState.gameMode && gameState.matchType);
}


export function startGame() {
    if (!canStartGame()) return;
    resetGameState();
    initializePlayerNames();
    startLoadingTransition({
        targetScreen: SCREENS.GAME,
        duration: 1800,
        label: "loading.startGame"
    });

    window.setTimeout(chooseStarter, 1800);
}


export function goBackToSetup() {
    resetPlayerState();
    resetGameState();
    navigateTo(SCREENS.SETUP);
}


export function handleCellClick(index) {
    if (gameState.gameOver) return;
    if (gameState.fields[index] !== null) return;
    if (isAiTurn()) return;

    placeMove(index);
    render();

    if (!gameState.gameOver && isAiTurn()) {
        scheduleAiMove();
    }
}


export function restartGame() {
    const starter = determineStarter();
    resetGameState();
    chooseStarter(starter);
}


export function updatePlayerName(playerId, value) {
    const index = playerId === "player-one" ? 0 : 1;
    gameState.players[index].name = createPlayerName(value, translate(`setup.player${index + 1}`));
}


export function resetPlayerState() {
    gameState.players = [
        { name: "", symbol: "cross" },
        { name: "", symbol: "circle" }
    ];
}


export function chooseStarter(player = null) {
    appState.starterSelection.visible = true;
    const starter = player ?? (Math.random() > 0.5 ? "cross" : "circle");
    const isRandom = player === null;

    appState.starterSelection.spinning = isRandom;
    appState.starterSelection.player = isRandom ? null : starter;
    gameState.starterPlayer = starter;
    render();

    if (!isRandom) return;

    window.setTimeout(() => {
        appState.starterSelection.player = starter;
        appState.starterSelection.spinning = false;
        render();
    }, STARTER_ANIMATION_TIME);
}


export function confirmStarter() {
    gameState.currentPlayer = gameState.starterPlayer;
    appState.starterSelection.visible = false;
    render();
    triggerAiMoveIfNeeded();
}


export function triggerAiMoveIfNeeded() {
    if (isAiTurn()) scheduleAiMove();
}


function scheduleAiMove() {
    window.setTimeout(() => {
        const index = getAiMove();
        if (index === -1) return;
        placeMove(index);
        render();
    }, 600);
}


function initializePlayerNames() {
    if (gameState.matchType === "singleplayer") {
        gameState.players[0].name = createPlayerName(
            gameState.players[0].name,
            translate("setup.you")
        );
        gameState.players[1].name =
            translate("setup.opponent") +
            " (" + translate(`setup.${gameState.difficulty}`) + ")";
    } else {
        gameState.players.forEach((player, index) => {
            player.name = createPlayerName(
                player.name,
                translate(index === 0 ? "setup.playerOne" : "setup.playerTwo")
            );
        });
    }
}


function resetGameState() {
    gameState.fields = Array(9).fill(null);
    gameState.currentPlayer = null;
    gameState.winner = null;
    gameState.winningCombination = null;
    gameState.isDraw = false;
    gameState.gameOver = false;
}


function determineStarter() {
    if (gameState.isDraw) return null;
    return gameState.winner === "cross" ? "circle" : "cross";
}
