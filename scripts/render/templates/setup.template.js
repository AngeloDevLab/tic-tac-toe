import { gameState } from "../../state.js";
import { translate } from "../../i18n/translate.js";
import { renderSelectableButton } from "./components/button.template.js";
import { getPlayerInput } from "./components/player.template.js";
import { canStartGame } from "../../game/game.js";


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

                            ${renderSelectableButton({
                                label: translate("setup.classic"),
                                value: "classic",
                                dataKey: "mode",
                                isSelected: gameState.gameMode === "classic"
                            })}

                            ${renderSelectableButton({
                                label: translate("setup.ultimate"),
                                value: "ultimate",
                                dataKey: "mode",
                                isSelected: gameState.gameMode === "ultimate",
                                disabled: true
                            })}

                        </div>
                    </div>

                    <div class="selection-group">
                        <h3>${translate("setup.matchType")}</h3>

                        <div class="button-group">

                            ${renderSelectableButton({
                                label: translate("setup.singleplayer"),
                                value: "singleplayer",
                                dataKey: "match",
                                isSelected: gameState.matchType === "singleplayer"
                            })}

                            ${renderSelectableButton({
                                label: translate("setup.local"),
                                value: "local",
                                dataKey: "match",
                                isSelected: gameState.matchType === "local"
                            })}

                            ${renderSelectableButton({
                                label: translate("setup.online"),
                                value: "online",
                                dataKey: "match",
                                isSelected: gameState.matchType === "online",
                                disabled: true
                            })}

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

                    <div class="match-config">

                        <h3>
                            ${translate("setup.matchConfiguration")}
                        </h3>

                        ${getPlayerConfigurationTemplate()}

                    </div>

                    <button
                        id="start-game-btn"
                        class="btn btn-primary "
                        ${!canStartGame() ? "disabled" : ""}
                    >
                        ${translate("setup.start")}
                    </button>

                </aside>

            </div>

        </section>
    `;
}


/**
 * Returns the player setup template
 * for the selected match type.
 *
 * @returns {string} HTML player configuration template.
 */
export function getPlayerConfigurationTemplate() {

    switch (gameState.matchType) {

        case "singleplayer":
            return getSingleplayerSetup();

        case "local":
            return getLocalSetup();

        case "online":
            return getOnlineSetup();

        default:
            return "";
    }
}


function getSingleplayerSetup() {
    return `
        <div class="player-config">

            ${getPlayerInput({
                id: "player-one",
                label: translate("setup.playerOne"),
                placeholder: translate("setup.you"),
                symbol: "cross"
            })}

            ${getPlayerInput({
                id: "player-two",
                label: translate("setup.playerTwo"),
                value: `${translate("setup.opponent")} (${translate("setup.easy")})`,
                disabled: true,
                symbol: "circle"
            })}

            <h4>
                ${translate("setup.difficulty")}
            </h4>

            <div class="button-group">

                ${renderSelectableButton({
                    label: translate("setup.easy"),
                    value: "easy",
                    dataKey: "difficulty",
                    isSelected: gameState.difficulty === "easy"
                })}

                ${renderSelectableButton({
                    label: translate("setup.medium"),
                    value: "medium",
                    dataKey: "difficulty",
                    isSelected: gameState.difficulty === "medium",
                    disabled: true
                })}

                ${renderSelectableButton({
                    label: translate("setup.hard"),
                    value: "hard",
                    dataKey: "difficulty",
                    isSelected: gameState.difficulty === "hard",
                    disabled: true
                })}

            </div>

        </div>
    `;
}


function getLocalSetup() {
    return `
        <div class="player-config">

            ${getPlayerInput({
                id: "player-one",
                label: translate("setup.playerOne"),
                placeholder: translate("setup.playerOne"),
                symbol: "cross"
            })}

            ${getPlayerInput({
                id: "player-two",
                label: translate("setup.playerTwo"),
                placeholder: translate("setup.playerTwo"),
                symbol: "circle"
            })}

        </div>
    `;
}


function getOnlineSetup() {
    return `<p>Coming soon</p>`;
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