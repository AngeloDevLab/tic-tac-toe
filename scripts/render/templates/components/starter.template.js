import { renderSymbol } from "./symbol.template.js";
import { appState, gameState } from "../../../state.js";
import { translate } from "../../../i18n/translate.js";

export function getStarterTemplate() {
    if (!appState.starterSelection.visible) {
        return "";
    }
    const starter =
        gameState.players.find(
            player =>
                player.symbol === gameState.starterPlayer
        );

    return `
        <div class="starter-content" closedby="any">

            <div
                class="starter-card ${appState.starterSelection.spinning
            ? "is-spinning"
            : ""
        }${appState.starterSelection.player === "circle"
            && !appState.starterSelection.spinning
            ? "show-back"
            : ""
        }">

                <div class="starter-face starter-front">
                    ${renderSymbol("cross")}
                </div>

                <div class="starter-face starter-back">
                    ${renderSymbol("circle")}
                </div>

            </div>

            ${!appState.starterSelection.spinning
            ? `
                        <div class="starter-result">

                            <p class="starter-text">
                                ${starter?.name}
                                ${translate("game.begins")}
                            </p>

                            <button
                                id="starter-confirm-btn"
                                class="btn btn-primary"
                            >
                                OK
                            </button>

                        </div>
                    `
            : ""
        }

        </div>
    `;
}