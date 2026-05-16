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
            <div class="brand-wrap">
                <img class="brand-logo" src="./assets/icons/favicon.svg" alt="GameHub logo">
                <span class="brand-name">GameHub</span>
            </div>
            <button id="help-btn" class="header-help-btn" type="button">Hilfe</button>
        </header>
    `;
}

export function getHelpModalTemplate() {
    return `
        <div id="help-overlay" class="help-overlay" aria-hidden="true">
            <article class="help-modal">
                <h2>Hilfe</h2>
                <p>Wähle zuerst Spielmodus und Match-Typ aus und starte dann das Spiel.</p>
                <p>Drei gleiche Symbole in einer Reihe gewinnen. Bei vollem Feld ohne Gewinner endet das Spiel unentschieden.</p>
                <button id="help-close-btn" class="game-button classic-btn" type="button">Schließen</button>
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
        <section class="landing-page">

            <div class="landing-card">
                <h1 class="game-title">Tic Tac Toe</h1>
                <p class="game-subtitle">Wähle Modus und Match-Typ</p>

                <div class="selection-group">
                    <h3>Game Mode</h3>
                    <div class="button-group">
                        ${renderSelectableButton("Classic", "classic", gameState.gameMode === "classic", "mode")}
                        ${renderSelectableButton("Ultimate", "ultimate", gameState.gameMode === "ultimate", "mode")}
                    </div>
                </div>

                <div class="selection-group">
                    <h3>Match Type</h3>
                    <div class="button-group">
                        ${renderSelectableButton("Singleplayer", "singleplayer", gameState.matchType === "singleplayer", "match")}
                        ${renderSelectableButton("Local Multiplayer", "local", gameState.matchType === "local", "match")}
                        ${renderSelectableButton("Online Multiplayer", "online", gameState.matchType === "online", "match")}
                    </div>
                </div>

                <div class="selection-summary">
                    <p><strong>Auswahl:</strong></p>
                    <p>Modus: ${formatSelectedValue(gameState.gameMode)}</p>
                    <p>Match: ${formatSelectedValue(gameState.matchType)}</p>
                </div>

                <button id="start-game-btn" class="game-button classic-btn" ${!canStart() ? "disabled" : ""}>Spiel starten</button>
            </div>

        </section>
    `;
}

export function getGameTemplate() {
    return `
        <section class="game-screen">

            <div class="game-container">

                <h1 class="game-title">Tic Tac Toe</h1>
                <div class="game-board">
                    ${renderCells()}
                    ${renderWinLine()}
                </div>

                <div class="game-action-row">
                    ${renderRestartButton()}
                    <button id="back-to-setup-btn" class="game-button secondary-btn">Zurück</button>
                </div>
            </div>

        </section>
    `;
}

function renderSelectableButton(label, value, isSelected, type) {
    const dataAttr = type === "mode" ? `data-mode="${value}"` : `data-match="${value}"`;
    return `<button class="game-button ${isSelected ? "classic-btn is-selected" : "secondary-btn"}" ${dataAttr}>${label}</button>`;
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
        return `<p class="game-status">${renderSymbol(gameState.winner)} Gewinnt!</p>`;
    }

    if (gameState.isDraw) {
        return `<p class="game-status">Unentschieden – kein Gewinner.</p>`;
    }

    return `<p class="game-status">Aktueller Spieler: ${renderSymbol(gameState.currentPlayer)}</p>`;
}

function renderRestartButton() {
    if (!gameState.gameOver) return "";
    return `<button id="restart-btn" class="game-button classic-btn">Neu starten</button>`;
}

function renderWinLine() {
    if (!gameState.winningCombination) return "";
    return `<div class="win-line ${getWinLineClass()}"></div>`;
}


function getWinLineClass() {
    const combination =gameState.winningCombination.join("-");
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
    if (!value) return "Noch nicht gewählt";
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