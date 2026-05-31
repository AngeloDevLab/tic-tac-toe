import {
    selectGameMode,
    selectMatchType,
    selectDifficulty,
    handleCellClick,
    handleUltimateCellClick,
    restartGame,
    canStartGame,
    startGame,
    goBackToSetup,
    updatePlayerName,
    confirmStarter
} from "../game/game.js";

import {
    toggleLanguage,
    updateLanguageButton
} from "../i18n/language.js";

import { appState, gameState, SCREENS } from "../state.js";
import { render } from "./render.js";


export function initGlobalEvents() {
    document.getElementById("help-btn")?.addEventListener("click", openHelpModal);
    document.getElementById("help-close-btn")?.addEventListener("click", closeHelpModal);
    document.getElementById("language-btn")?.addEventListener("click", handleLanguageToggle);

    const helpModal = document.getElementById("help-modal");
    helpModal?.addEventListener("click", (e) => {
        if (e.target === helpModal) closeHelpModal();
    });
    helpModal?.addEventListener("close", () => {
        document.getElementById("help-btn")?.focus();
    });

    if (appState.currentScreen === SCREENS.SETUP) initSetupEvents();
    if (appState.currentScreen === SCREENS.GAME) initGameEvents();
}


function initSetupEvents() {
    document.querySelectorAll("[data-mode]").forEach(btn =>
        btn.addEventListener("click", () => selectGameMode(btn.dataset.mode))
    );

    document.querySelectorAll("[data-match]").forEach(btn =>
        btn.addEventListener("click", () => selectMatchType(btn.dataset.match))
    );

    document.querySelectorAll("[data-difficulty]").forEach(btn =>
        btn.addEventListener("click", () => selectDifficulty(btn.dataset.difficulty))
    );

    document.getElementById("start-game-btn")?.addEventListener("click", () => {
        if (canStartGame()) startGame();
    });

    document.querySelectorAll("[data-player]").forEach(input =>
        input.addEventListener("input", () => updatePlayerName(input.dataset.player, input.value))
    );
}


function initGameEvents() {
    if (gameState.gameMode === "ultimate") {
        document.querySelectorAll(".ultimate-cell").forEach(cell =>
            cell.addEventListener("click", () => handleUltimateCellClick(
                Number(cell.dataset.board),
                Number(cell.dataset.cell)
            ))
        );
    } else {
        document.querySelectorAll(".cell").forEach(cell =>
            cell.addEventListener("click", () => handleCellClick(Number(cell.dataset.index)))
        );
    }

    document.getElementById("restart-btn")?.addEventListener("click", restartGame);
    document.getElementById("back-to-setup-btn")?.addEventListener("click", goBackToSetup);
    document.getElementById("starter-confirm-btn")?.addEventListener("click", confirmStarter);

    const starterDialog = document.getElementById("starter-dialog");
    if (starterDialog) {
        starterDialog.showModal();

        starterDialog.addEventListener("click", (e) => {
            if (e.target === starterDialog && !appState.starterSelection.spinning) {
                confirmStarter();
            }
        });

        starterDialog.addEventListener("cancel", (e) => {
            e.preventDefault();
            if (!appState.starterSelection.spinning) {
                confirmStarter();
            }
        });
    }
}


function openHelpModal() {
    document.getElementById("help-modal")?.showModal();
}


function closeHelpModal() {
    document.getElementById("help-modal")?.close();
}


function handleLanguageToggle() {
    toggleLanguage();
    updateLanguageButton();
    render();
}
