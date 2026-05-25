import {
    appState,
    gameState,
    SCREENS
} from "../state.js";

import {
    getSetupTemplate,
    getLoadingTemplate,
    getGameTemplate
} from "./templates/index.js";

import {
    selectGameMode,
    selectMatchType,
    handleCellClick,
    restartGame,
    canStartGame,
    startGame,
    goBackToSetup
} from "../game/game.js";

import {
    getLanguage,
    setLanguage,
    saveLanguage,
    updateLanguageButton
} from "../i18n/language.js";

import {
    applyTranslations
} from "../i18n/applyTranslations.js";

import {
    translate
} from "../i18n/translate.js";

import { updatePlayerName } from "../game/game.js";

let loadingTimer = null;

export function initApp() {
    startLoadingTransition({
        targetScreen: SCREENS.SETUP,
        duration: 1400,
        label: "loading.title"
    });
}

export function navigateTo(screen) {
    appState.currentScreen = screen;
    render();
}

export function startLoadingTransition({ targetScreen, duration, label }) {
    window.clearInterval(loadingTimer);
    appState.currentScreen = SCREENS.LOADING;
    appState.loading.progress = 0;
    render();
    const intervalMs = 35;
    const step = Math.ceil(100 / (duration / intervalMs));
    loadingTimer = window.setInterval(() => {

        appState.loading.progress =
            Math.min(
                100,
                appState.loading.progress + step
            );

        appState.loading.label =
            `${translate(label)} ${".".repeat(
                (Math.floor(
                    appState.loading.progress / 20
                ) % 3) + 1
            )}`;

        if (appState.loading.progress >= 100) {

            window.clearInterval(
                loadingTimer
            );

            appState.currentScreen =
                targetScreen;

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
    applyTranslations();
    updateLanguageButton();
}

function getMainTemplate() {
    if (appState.currentScreen === SCREENS.LOADING) {
        return getLoadingTemplate();
    }

    if (appState.currentScreen === SCREENS.SETUP) {
        return getSetupTemplate();
    }

    if (appState.currentScreen === SCREENS.GAME) {
        return getGameTemplate();
    }

    return "";
}

function initGlobalEvents() {
    document.getElementById("help-btn")?.addEventListener("click", openHelpModal);
    document.getElementById("help-close-btn")?.addEventListener("click", closeHelpModal);
    document.getElementById("language-btn")?.addEventListener("click", toggleLanguage);
    document.getElementById("help-overlay")?.addEventListener("click", (event) => {
        if (event.target.id === "help-overlay") closeHelpModal();
    });

    if (appState.currentScreen === SCREENS.SETUP) initSetupEvents();
    if (appState.currentScreen === SCREENS.GAME) initGameEvents();
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

    document.querySelectorAll("[data-player]").forEach((input) => {
        input.addEventListener("input", () => {
            updatePlayerName(
                input.dataset.player,
                input.value
            );
        });
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

function toggleLanguage() {
    const nextLanguage = getLanguage() === "en" ? "de" : "en";
    setLanguage(nextLanguage);
    saveLanguage();
    render();
}