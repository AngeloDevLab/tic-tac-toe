

/**
 * Returns a labeled player name input field.
 *
 * @param {object} options
 * @param {string} options.id - Input element ID and data-player value.
 * @param {string} options.label - Visible label text.
 * @param {string} options.placeholder - Input placeholder text.
 * @param {string} [options.value=""] - Pre-filled input value.
 * @param {boolean} [options.disabled=false] - Whether the input is disabled.
 * @param {string} options.symbol - Symbol icon name ("cross" or "circle").
 *
 * @returns {string} HTML input group template.
 */
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