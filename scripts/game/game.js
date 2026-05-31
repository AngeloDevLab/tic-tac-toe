import { appState, gameState, SCREENS } from "../state.js";
import { render, startLoadingTransition, navigateTo } from "../render/render.js";
import { createPlayerName, sanitizePlayerName } from "./players.js";
import { translate } from "../i18n/translate.js";
import { placeMove } from "./gamemodes/classic.js";
import { isAiTurn, getAiMove } from "./aiController.js";
import { initUltimateState, isUltimateBoardPlayable, placeUltimateMove } from "./gamemodes/ultimate.js";


const STARTER_ANIMATION_TIME = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 2500;


/**
 * Sets the selected game mode and re-renders the setup screen.
 *
 * @param {string} mode - Game mode ("classic" or "ultimate").
 */
export function selectGameMode(mode) {
    gameState.gameMode = mode;
    render();
}


/**
 * Sets the selected match type and re-renders the setup screen.
 *
 * @param {string} type - Match type ("singleplayer", "local" or "online").
 */
export function selectMatchType(type) {
    gameState.matchType = type;
    render();
}


/**
 * Sets the AI difficulty and re-renders the setup screen.
 *
 * @param {string} difficulty - Difficulty level ("easy", "medium" or "hard").
 */
export function selectDifficulty(difficulty) {
    gameState.difficulty = difficulty;
    render();
}


/**
 * Returns whether the game can be started with the current setup selection.
 *
 * @returns {boolean}
 */
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


/**
 * Handles a classic board cell click.
 * Ignores clicks on filled cells, during AI turns, or after game over.
 *
 * @param {number} index - Cell index (0–8).
 */
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


/**
 * Handles an Ultimate board cell click.
 * Ignores clicks on invalid boards, filled cells, during AI turns, or after game over.
 *
 * @param {number} boardIndex - Index of the mini-board (0–8).
 * @param {number} cellIndex - Index of the cell within that board (0–8).
 */
export function handleUltimateCellClick(boardIndex, cellIndex) {
    if (gameState.gameOver) return;
    if (isAiTurn()) return;
    if (!isUltimateBoardPlayable(boardIndex)) return;
    if (gameState.ultimateBoards[boardIndex][cellIndex] !== null) return;

    placeUltimateMove(boardIndex, cellIndex);
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


/**
 * Updates a player's name from the setup input field.
 *
 * @param {string} playerId - Input data-player value ("player-one" or "player-two").
 * @param {string} value - Raw input value.
 */
export function updatePlayerName(playerId, value) {
    const index = playerId === "player-one" ? 0 : 1;
    gameState.players[index].name = sanitizePlayerName(value);
}


export function resetPlayerState() {
    gameState.players = [
        { name: "", symbol: "cross" },
        { name: "", symbol: "circle" }
    ];
}


/**
 * Starts the starter selection animation.
 * Randomly picks a starter if no player is provided.
 *
 * @param {string|null} [player=null] - Symbol of the player to start ("cross" or "circle"), or null for random.
 */
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
        if (gameState.gameMode === "ultimate") {
            const move = getAiMove();
            if (!move) return;
            placeUltimateMove(move.boardIndex, move.cellIndex);
        } else {
            const index = getAiMove();
            if (index === -1) return;
            placeMove(index);
        }
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

    if (gameState.gameMode === "ultimate") {
        initUltimateState();
    }
}


function determineStarter() {
    if (gameState.isDraw) return null;
    return gameState.winner === "cross" ? "circle" : "cross";
}
