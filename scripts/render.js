import { gameState, SCREENS } from "./state.js";

import {
    getSetupTemplate,
    getLoadingTemplate,
    getGameTemplate,
} from "./templates.js";

import {
    selectGameMode,
    selectMatchType,
    handleCellClick,
    restartGame,
    canStartGame,
    startGame,
    goBackToSetup
} from "./game.js";

let loadingTimer = null;

export function initApp() {
    startLoadingTransition({
        targetScreen: SCREENS.SETUP,
        duration: 1400,
        label: "loading"
    });
}

export function navigateTo(screen) {
    gameState.currentScreen = screen;
    render();
}

export function startLoadingTransition({ targetScreen, duration, label}) {
    window.clearInterval(loadingTimer);
    gameState.currentScreen = SCREENS.LOADING;
    gameState.loadingProgress = 0;
    render();

    const intervalMs = 35;
    const step = Math.ceil(100 / (duration / intervalMs));

    loadingTimer = window.setInterval(() => {
        gameState.loadingProgress = Math.min(100, gameState.loadingProgress + step);
        gameState.loadingLabel = `${label} ${".".repeat((Math.floor(gameState.loadingProgress / 20) % 3) + 1)}`;

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
    const app = document.getElementById("app-main");
    app.innerHTML = getMainTemplate();
    initGlobalEvents();
}

function getMainTemplate() {
    if (gameState.currentScreen === SCREENS.LOADING) {
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
        if (canStartGame()) startGame();
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
    const overlay = document.getElementById("help-overlay");
    const closeBtn = document.getElementById("help-close-btn");
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    closeBtn.focus();
}

function closeHelpModal() {
    const overlay = document.getElementById("help-overlay");
    const helpBtn = document.getElementById("help-btn");
    helpBtn.focus();
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
}