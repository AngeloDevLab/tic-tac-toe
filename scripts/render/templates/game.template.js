import { gameState } from "../../state.js";
import { translate } from "../../i18n/translate.js";
import { renderSymbol } from "./components/symbol.template.js";
import { getStarterTemplate } from "./components/starter.template.js";


export function getGameTemplate() {
    return `
        <section class="game-screen">

            <div class="game-container max-content">

                <div class="board-panel">
                    ${gameState.gameMode === "ultimate" ? renderUltimateBoard() : renderClassicBoard()}
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

            ${getStarterTemplate()}

        </section>
    `;
}


function renderClassicBoard() {
    return `
        <div class="game-board">
            ${renderCells()}
            ${renderWinLine()}
        </div>
    `;
}


function renderCells() {
    return gameState.fields
        .map((field, index) => {
            const isWinner = gameState.winningCombination?.includes(index);
            return `<div class="cell${isWinner ? " is-winner" : ""}" data-index="${index}">${renderSymbol(field)}</div>`;
        })
        .join("");
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


function renderUltimateBoard() {
    return `
        <div class="ultimate-board">
            ${gameState.ultimateBoards.map((board, boardIndex) =>
                renderMiniBoard(board, boardIndex)
            ).join("")}
            ${renderWinLine()}
        </div>
    `;
}


function renderMiniBoard(board, boardIndex) {
    const winner = gameState.ultimateBoardWinners[boardIndex];
    const isForced = gameState.activeBoardIndex !== null;
    const isTargeted = isForced && gameState.activeBoardIndex === boardIndex;
    const isDimmed = isForced && !isTargeted && !winner && !gameState.gameOver;
    const isFreeChoice = !isForced && !winner && !gameState.gameOver;
    const isGlobalWinner = gameState.winningCombination?.includes(boardIndex);

    const classes = [
        "mini-board",
        winner ? "is-won" : "",
        isTargeted ? "is-targeted" : "",
        isFreeChoice ? "is-free-choice" : "",
        isDimmed ? "is-dimmed" : "",
        isGlobalWinner ? "is-global-winner" : ""
    ].filter(Boolean).join(" ");

    return `
        <div class="${classes}">
            ${board.map((cell, cellIndex) => `
                <div class="ultimate-cell"
                     data-board="${boardIndex}"
                     data-cell="${cellIndex}">
                    ${renderSymbol(cell)}
                </div>
            `).join("")}
            ${winner ? renderMiniBoardOverlay(winner) : ""}
        </div>
    `;
}


function renderMiniBoardOverlay(winner) {
    if (winner === "draw") {
        return `<div class="mini-board-overlay mini-board-draw"></div>`;
    }
    return `
        <div class="mini-board-overlay">
            ${renderSymbol(winner)}
        </div>
    `;
}


function renderGameStatus() {
    if (gameState.winner) {
        return `<p class="game-status">${renderSymbol(gameState.winner)}${translate("game.winner")} </p>`;
    }

    if (gameState.isDraw) {
        return `<p class="game-status">${translate("game.draw")}</p>`;
    }

    return "";
}


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
