

export function getPlayerInput({ id, label, placeholder, value = "", disabled = false, symbol }) {
    return `
        <div class="input-group">
            <label class="label" for="${id}">
                <img class="player-input-symbol" src="./assets/icons/${symbol}.svg" alt="${symbol} image">
                ${label}
            </label>

            <input
                type="text"
                id="${id}"
                class="input"
                data-player="${id}"
                maxlength="12"
                value="${value}"
                placeholder="${placeholder}"
                ${disabled ? "disabled" : ""}
            >
        </div>
    `;
}