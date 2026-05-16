//==================================================
// RENDER.JS
//==================================================
// Handles all UI rendering and DOM updates.
//
// Responsibilities:
// - Render game boards
// - Render symbols and UI elements
// - Update the visual game state
// - Render menus, winner screens and overlays
//
// Only visual logic belongs here.
//==================================================
import { gameState, SCREENS } from "./state.js";

import {
    getAppLayoutTemplate,
    getHeaderTemplate,
    getSetupTemplate,
    getLoadingTemplate,
    getGameTemplate,
    getHelpModalTemplate
} from "./templates.js";

import {
    selectGameMode,
    selectMatchType,
    handleCellClick,
    restartGame,
    canStartGame,
    startGameFlow,
    goBackToSetup
} from "./game.js";

let loadingTimer = null;

export function initApp() {
    startLoadingTransition({
        targetScreen: SCREENS.SETUP,
        loadingScreen: SCREENS.LOADING_INITIAL,
        duration: 1600
    });
}

export function navigateTo(screen) {
    gameState.currentScreen = screen;
    render();
}

export function startLoadingTransition({ targetScreen, loadingScreen, duration = 1500 }) {
    window.clearInterval(loadingTimer);
    gameState.currentScreen = loadingScreen;
    gameState.loadingProgress = 0;
    gameState.loadingLabel = "Loading";
    render();

    const intervalMs = 35;
    const step = Math.ceil(100 / (duration / intervalMs));

    loadingTimer = window.setInterval(() => {
        gameState.loadingProgress = Math.min(100, gameState.loadingProgress + step);
        gameState.loadingLabel = `Loading${".".repeat((Math.floor(gameState.loadingProgress / 20) % 3) + 1)}`;

        if (gameState.loadingProgress >= 100) {
            window.clearInterval(loadingTimer);
            gameState.currentScreen = targetScreen;
            render();
            return;
        }

        render();
    }, intervalMs);
}

export function render() {
    const app = document.getElementById("app");
    app.innerHTML = getAppLayoutTemplate({
        header: getHeaderTemplate(),
        main: getMainTemplate(),
        modal: getHelpModalTemplate()
    });

    initGlobalEvents();
}

function getMainTemplate() {
    if (gameState.currentScreen === SCREENS.LOADING_INITIAL ||
        gameState.currentScreen === SCREENS.LOADING_GAME) {
        return getLoadingTemplate();
    }

    if (gameState.currentScreen === SCREENS.SETUP) {
        return getSetupTemplate();
    }

    if (gameState.currentScreen === SCREENS.GAME) {
        return getGameTemplate();
    }

    return "";
}

function initGlobalEvents() {
    document.getElementById("help-btn")?.addEventListener("click", openHelpModal);
    document.getElementById("help-close-btn")?.addEventListener("click", closeHelpModal);
    document.getElementById("help-overlay")?.addEventListener("click", (event) => {
        if (event.target.id === "help-overlay") closeHelpModal();
    });

    if (gameState.currentScreen === SCREENS.SETUP) initSetupEvents();
    if (gameState.currentScreen === SCREENS.GAME) initGameEvents();
}

function initSetupEvents() {
    document.querySelectorAll("[data-mode]").forEach((button) => {
        button.addEventListener("click", () => selectGameMode(button.dataset.mode));
    });

    document.querySelectorAll("[data-match]").forEach((button) => {
        button.addEventListener("click", () => selectMatchType(button.dataset.match));
    });

    document.getElementById("start-game-btn")?.addEventListener("click", () => {
        if (canStartGame()) startGameFlow();
    });
}

function initGameEvents() {
    document.querySelectorAll(".cell").forEach((cell) => {
        cell.addEventListener("click", () => handleCellClick(Number(cell.dataset.index)));
    });

    document.getElementById("restart-btn")?.addEventListener("click", restartGame);
    document.getElementById("back-to-setup-btn")?.addEventListener("click", goBackToSetup);
}

function openHelpModal() {
    document.getElementById("help-overlay")?.classList.add("is-open");
}

function closeHelpModal() {
    document.getElementById("help-overlay")?.classList.remove("is-open");
}