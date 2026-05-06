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
        <section class="landing-page">

            <div class="landing-card">

                <h1 class="game-title">
                    Game Started
                </h1>

            </div>

        </section>
    `;
}