import { gameState } from "../../state.js";
import { translate } from "../../i18n/translate.js";
import { renderSymbol } from "./components/symbol.template.js";

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
                        ${renderPlayerPanels()}
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

    return "";
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
 * Renders the restart button
 * after the game is over.
 *
 * @returns {string} HTML button template.
 */
function renderRestartButton() {
    if (!gameState.gameOver) return "";
    return `<button id="restart-btn" class="btn btn-primary">${translate("game.restart")}</button>`;
}


function renderPlayerPanels() {

    return gameState.players
        .map((player) => `
            <div class=" player-panel ${player.symbol === gameState.currentPlayer ? "is-active" : ""}">
                <div class="player-symbol">
                    ${renderSymbol(player.symbol)}
                </div>

                <div class="player-info">
                    <span class="player-name">
                        ${player.name}
                    </span>
                </div>
            </div>
        `)

        .join("");
}