//==================================================
// TEMPLATES.JS
//==================================================
// Contains reusable HTML template functions.
//
// Responsibilities:
// - Generate HTML structures
// - Return template strings
// - Keep markup separated from logic
//
// No game logic or DOM manipulation here.
//==================================================

import { gameState } from "./state.js";

export function getAppLayoutTemplate({ header, main, modal }) {
    return `
        ${header}
        <main class="app-main">${main}</main>
        ${modal}
    `;
}

export function getHeaderTemplate() {
    return `
        <header class="app-header">
            <div class="header-wrap max-content">
                <div class="brand-wrap">
                    <img class="brand-logo" src="./assets/icons/favicon.svg" alt="GameHub logo">
                    <span class="hide-on-mobile brand-name">GameHub</span>
                </div>

                <div class="header-actions">
                    <button id="help-btn" class="btn btn-ghost header-btn" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="hide-on-mobile">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 16v-4"/>
                            <path d="M12 8h.01"/>
                        </svg>
                        help
                    </button>

                    <button id="language-btn" class="btn btn-ghost header-btn" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="hide-on-mobile">
                            <path d="m5 8 6 6"/>
                            <path d="m4 14 6-6 2-3"/>
                            <path d="M2 5h12"/>
                            <path d="M7 2h1"/>
                            <path d="m22 22-5-10-5 10"/>
                            <path d="M14 18h6"/>
                        </svg>
                        eng
                    </button>
                </div>
            </div>
        </header>
    `;
}

export function getHelpModalTemplate() {
    return `
        <div id="help-overlay" class="help-overlay" aria-hidden="true">
            <article class="help-modal">
                <h2>How to Play</h2>
                <p>Choose a game mode and match type before starting the game.</p>
                <p>Match three symbols in a row to win the game.</p>
                <p>If the board is full and nobody wins, the match ends in a draw.</p>
                <button id="help-close-btn" class="btn btn-ghost" type="button">Schließen</button>
            </article>
        </div>
    `;
}

export function getLoadingTemplate() {
    return `
        <section class="loading-screen">
            <div class="loading-card">
                <h1 class="game-title">GameHub</h1>
                <p class="loading-label">${gameState.loadingLabel} ${gameState.loadingProgress}%</p>
                <div class="loading-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${gameState.loadingProgress}">
                    <div class="loading-fill" style="width: ${gameState.loadingProgress}%;"></div>
                </div>

            </div>

        </section>
    `;
}

export function getSetupTemplate() {
    return `
        <section class="setup-page max-content">

            <div class="setup-container">

                <div class="setup-panel">

                    <div class="setup-header">
                        <h1 class="game-title">Tic Tac Toe</h1>
                        <p class="game-subtitle">
                            Choose your game mode and match type
                        </p>
                    </div>

                    <div class="selection-group">
                        <h3>Game Mode</h3>

                        <div class="button-group">
                            ${renderSelectableButton(
                                "Classic",
                                "classic",
                                gameState.gameMode === "classic",
                                "mode"
                            )}

                            ${renderSelectableButton(
                                "Ultimate",
                                "ultimate",
                                gameState.gameMode === "ultimate",
                                "mode"
                            )}
                        </div>
                    </div>

                    <div class="selection-group">
                        <h3>Match Type</h3>

                        <div class="button-group">
                            ${renderSelectableButton(
                                "Singleplayer",
                                "singleplayer",
                                gameState.matchType === "singleplayer",
                                "match"
                            )}

                            ${renderSelectableButton(
                                "Local Multiplayer",
                                "local",
                                gameState.matchType === "local",
                                "match"
                            )}

                            ${renderSelectableButton(
                                "Online Multiplayer",
                                "online",
                                gameState.matchType === "online",
                                "match"
                            )}
                        </div>
                    </div>

                </div>

                <aside class="summary-panel">

                    <div class="selection-summary">
                        <h3>Current Selection</h3>

                        <p>
                            <strong>Mode:</strong>
                            ${formatSelectedValue(gameState.gameMode)}
                        </p>

                        <p>
                            <strong>Match:</strong>
                            ${formatSelectedValue(gameState.matchType)}
                        </p>
                    </div>

                    <button
                        id="start-game-btn"
                        class="btn btn-primary "
                        ${!canStart() ? "disabled" : ""}
                    >
                        Start Game
                    </button>

                </aside>

            </div>

        </section>
    `;
}

export function getGameTemplate() {
    return `
        <section class="game-screen">

            <div class="game-container">

                <div class="game-header">
                    ${renderGameStatus()}
                </div>
                <div class="game-board">
                    ${renderCells()}
                    ${renderWinLine()}
                </div>

                <div class="game-action-row">
                    ${renderRestartButton()}
                    <button id="back-to-setup-btn" class="btn btn-secondary">Back</button>
                </div>
            </div>

        </section>
    `;
}

function renderSelectableButton(label, value, isSelected, type) {
    const dataAttr = type === "mode" ? `data-mode="${value}"` : `data-match="${value}"`;
    return `<button class="btn btn-secondary ${isSelected ? "is-selected" : ""}" ${dataAttr}>${label}</button>`;
}

function renderCells() {
    return gameState.fields
        .map((field, index) => `
            <div class="cell" data-index="${index}">${renderSymbol(field)}</div>
        `)
        .join("");
}

function renderSymbol(symbol) {
    if (symbol === "cross") return `<img src="./assets/icons/cross.svg" alt="Cross">`;
    if (symbol === "circle") return `<img src="./assets/icons/circle.svg" alt="Circle">`;
    return "";
}

function renderGameStatus() {

    if (gameState.winner) {
        return `<p class="game-status">${renderSymbol(gameState.winner)} wins the game!</p>`;
    }

    if (gameState.isDraw) {
        return `<p class="game-status">Draw - no winner.</p>`;
    }

    return `<p class="game-status">Current Player: ${renderSymbol(gameState.currentPlayer)}</p>`;
}

function renderRestartButton() {
    if (!gameState.gameOver) return "";
    return `<button id="restart-btn" class="btn btn-primary">Restart</button>`;
}

function renderWinLine() {
    if (!gameState.winningCombination) return "";
    return `<div class="win-line ${getWinLineClass()}"></div>`;
}


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

function formatSelectedValue(value) {
    if (!value) return "No selection";
    const labelMap = {
        classic: "Classic",
        ultimate: "Ultimate",
        singleplayer: "Singleplayer",
        local: "Local Multiplayer",
        online: "Online Multiplayer"
    };

    return labelMap[value] ?? value;
}

function canStart() {
    return Boolean(gameState.gameMode && gameState.matchType);
}