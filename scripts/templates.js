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

export function getLandingPageTemplate() {
    return `
        <section class="landing-page">

            <div class="landing-card">

                <h1 class="game-title">
                    Tic Tac Toe
                </h1>

                <p class="game-subtitle">
                    Choose your game mode
                </p>

                <div class="button-group">

                    <button id="classic-btn" class="game-button classic-btn">
                        Classic Mode
                    </button>

                    <button id="ultimate-btn" class="game-button ultimate-btn">
                        Ultimate Mode (WIP)
                    </button>

                </div>

            </div>

        </section>
    `;
}

export function getMatchTypeTemplate() {
    return `
        <section class="landing-page">

            <div class="landing-card">

                <h1 class="game-title">
                    Select Match Type
                </h1>

                <div class="button-group">

                    <button id="singleplayer-btn" class="game-button classic-btn">
                        Singleplayer (WIP)
                    </button>

                    <button id="local-btn" class="game-button classic-btn">
                        Local Multiplayer
                    </button>

                    <button id="online-btn" class="game-button ultimate-btn">
                        Online Multiplayer (WIP)
                    </button>

                </div>

            </div>

        </section>
    `;
}

export function getGameTemplate() {
    return `
        <section class="game-screen">

            <div class="game-container">

                <h1 class="game-title">
                    Tic Tac Toe
                </h1>


                <div class="game-board">
                    ${renderCells()}
                    ${renderWinLine()}
                </div>

                ${renderGameStatus()}
                ${renderRestartButton()}

            </div>

        </section>
    `;
}

function renderCells() {
    let html = "";
    gameState.fields.forEach((field, index) => {

        html += `
            <div
                class="cell"
                data-index="${index}"
            >
                ${renderSymbol(field)}
            </div>
        `;
    });

    return html;
}

function renderSymbol(symbol) {

    if (symbol === "cross") {
        return `
            <img
                src="./assets/icons/cross.svg"
                alt="Cross"
            >
        `;
    }

    if (symbol === "circle") {
        return `
            <img
                src="./assets/icons/circle.svg"
                alt="Circle"
            >
        `;
    }

    return "";
}

function renderCurrentPlayer() {
    return renderSymbol(gameState.currentPlayer);
}

function renderGameStatus() {

    if (gameState.winner) {
        return `
            <p class="game-status">
                ${renderSymbol(gameState.winner)}
                Wins!
            </p>
        `;
    }

    return `
        <p class="game-status">
            Current Player:
            ${renderSymbol(gameState.currentPlayer)}
        </p>
    `;
}

function renderRestartButton() {

    if (!gameState.gameOver) {
        return "";
    }

    return `
        <button
            id="restart-btn"
            class="game-button classic-btn"
        >
            Play Again
        </button>
    `;
}

function renderWinLine() {

    if (!gameState.winningCombination) {
        return "";
    }

    return `
        <div
            class="win-line ${getWinLineClass()}"
        ></div>
    `;
}


function getWinLineClass() {

    const combination =
        gameState.winningCombination.join("-");

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