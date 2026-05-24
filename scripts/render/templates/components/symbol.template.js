/**
 * Returns the corresponding symbol image.
 *
 * @param {string|null} symbol
 *
 * @returns {string} HTML image template.
 */
export function renderSymbol(symbol) {
    if (symbol === "cross") return `<img src="./assets/icons/cross.svg" alt="Cross">`;
    if (symbol === "circle") return `<img src="./assets/icons/circle.svg" alt="Circle">`;
    return "";
}