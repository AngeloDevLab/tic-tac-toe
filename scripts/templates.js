import {
    appState,
    gameState
} from "./state.js";

import { translate } from "./i18n/translate.js";


/**
 * Returns the loading screen template.
 *
 * @returns {string}
 */
export function getLoadingTemplate() {
    return `
        <section class="loading-screen">
            <div class="loading-card">
                <h1 class="game-title">GameHub</h1>
                <p class="loading-label">${appState.loading.label} ${appState.loading.progress}%</p>
                <div class="loading-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${gameState.loadingProgress}"">
                    <div class="loading-fill" style="width: ${appState.loading.progress}%"%;"></div>
                </div>

            </div>

        </section>
    `;
}


/**
 * Returns the setup screen template.
 *
 * @returns {string}
 */
export function getSetupTemplate() {
    return `
        <section class="setup-page max-content">

            <div class="setup-container">

                <div class="setup-panel">

                    <div class="setup-header">
                        <h1 class="game-title">
                            Tic Tac Toe
                        </h1>
                        <p class="game-subtitle">
                            ${translate("setup.subtitle")}
                        </p>
                    </div>

                    <div class="selection-group">
                        <h3>${translate("setup.gameMode")}</h3>

                        <div class="button-group">
                            ${renderSelectableButton(
        translate("setup.classic"),
        "classic",
        gameState.gameMode === "classic",
        "mode",
        false
    )}

                            ${renderSelectableButton(
        translate("setup.ultimate"),
        "ultimate",
        gameState.gameMode === "ultimate",
        "mode",
        true
    )}
                        </div>
                    </div>

                    <div class="selection-group">
                        <h3>${translate("setup.matchType")}</h3>

                        <div class="button-group">
                            ${renderSelectableButton(
        translate("setup.singleplayer"),
        "singleplayer",
        gameState.matchType === "singleplayer",
        "match",
        true
    )}

                            ${renderSelectableButton(
        translate("setup.local"),
        "local",
        gameState.matchType === "local",
        "match",
        false
    )}

                            ${renderSelectableButton(
        translate("setup.online"),
        "online",
        gameState.matchType === "online",
        "match",
        true
    )}
                        </div>
                    </div>

                </div>

                <aside class="summary-panel">

                    <div class="selection-summary">
                        <h3>${translate("setup.currentSelection")}</h3>

                        <p>
                            <strong>${translate("setup.selectedMode")}:</strong>
                            ${formatSelectedValue(gameState.gameMode)}
                        </p>

                        <p>
                            <strong>${translate("setup.selectedMatch")}:</strong>
                            ${formatSelectedValue(gameState.matchType)}
                        </p>
                    </div>

                    <button
                        id="start-game-btn"
                        class="btn btn-primary "
                        ${!canStart() ? "disabled" : ""}
                    >
                        ${translate("setup.start")}
                    </button>

                </aside>

            </div>

        </section>
    `;
}

/**
 * Returns the active game screen template.
 *
 * @returns {string}
 */
export function getGameTemplate() {
    return `
        <section class="game-screen">

            <div class="game-container max-content">

                <div class="board-panel">

                    <div class="game-board">
                        ${renderCells()}
                        ${renderWinLine()}
                    </div>

                </div>
                
                <div class="game-panel">

                    <div class="game-header">
                        ${renderGameStatus()}
                    </div>

                    <div class="game-action-row">
                        ${renderRestartButton()}
                        <button
                            id="back-to-setup-btn"
                            class="btn btn-secondary">
                            ${translate("game.back")}
                        </button>
                    </div>

                </div>
            </div>

        </section>
    `;
}


/**
 * Renders a selectable option button.
 *
 * @param {string} label - Visible button text.
 * @param {string} value - Internal button value.
 * @param {boolean} isSelected - Selection state.
 * @param {string} type - Option category.
 * @param {boolean} isDisabled
 *
 * @returns {string} HTML button template.
 */
function renderSelectableButton(label, value, isSelected, type, isDisabled) {
    const dataAttr = type === "mode" ? `data-mode="${value}"` : `data-match="${value}"`;
    return `<button class="btn btn-secondary ${isSelected ? "is-selected" : ""}" ${dataAttr} ${isDisabled ? "disabled" : ""}>${label}</button>`;
}


/**
 * Renders all board cells.
 */
function renderCells() {
    return gameState.fields
        .map((field, index) => `
            <div class="cell" data-index="${index}">${renderSymbol(field)}</div>
        `)
        .join("");
}


/**
 * Returns the corresponding symbol image.
 *
 * @param {string|null} symbol
 *
 * @returns {string} HTML image template.
 */
function renderSymbol(symbol) {
    if (symbol === "cross") return `<img src="./assets/icons/cross.svg" alt="Cross">`;
    if (symbol === "circle") return `<img src="./assets/icons/circle.svg" alt="Circle">`;
    return "";
}


/**
 * Renders the current game status message.
 *
 * Displays:
 * - current player
 * - winner state
 * - draw state
 *
 * @returns {string} HTML status template.
 */
function renderGameStatus() {

    if (gameState.winner) {
        return `<p class="game-status">${renderSymbol(gameState.winner)}${translate("game.winner")} </p>`;
    }

    if (gameState.isDraw) {
        return `<p class="game-status">${translate("game.draw")}</p>`;
    }

    return `<p class="game-status">           
                ${translate("game.currentPlayer")}:
                ${renderSymbol(gameState.currentPlayer)}
            </p>`;
}


/**
 * Renders the restart button
 * after the game is over.
 *
 * @returns {string} HTML button template.
 */
function renderRestartButton() {
    if (!gameState.gameOver) return "";
    return `<button id="restart-btn" class="btn btn-primary">${translate("game.restart")}</button>`;
}


/**
 * Renders the winning line overlay
 * for the current winning combination.
 *
 * @returns {string} HTML win line template.
 */
function renderWinLine() {
    if (!gameState.winningCombination) return "";
    return `<div class="win-line ${getWinLineClass()}"></div>`;
}


/**
 * Returns the CSS class name
 * for the current winning combination.
 *
 * @returns {string}
 */
function getWinLineClass() {
    const combination = gameState.winningCombination.join("-");
    const classes = {
        "0-1-2": "win-row-top",
        "3-4-5": "win-row-middle",
        "6-7-8": "win-row-bottom",
        "0-3-6": "win-col-left",
        "1-4-7": "win-col-middle",
        "2-5-8": "win-col-right",
        "0-4-8": "win-diagonal-main",
        "2-4-6": "win-diagonal-secondary"
    };

    return classes[combination];
}


/**
 * Formats internal selection values
 * into readable labels.
 *
 * @param {string|null} value
 *
 * @returns {string}
 */
function formatSelectedValue(value) {
    if (!value) { return translate("setup.noSelection"); }
    return translate(`setup.${value}`);
}


/**
 * Checks whether the game
 * can be started.
 *
 * @returns {boolean}
 */
function canStart() {
    return Boolean(gameState.gameMode && gameState.matchType);
}