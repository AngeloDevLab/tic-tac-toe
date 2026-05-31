import { gameState } from "../state.js";


/**
 * Finds a player by their symbol.
 *
 * @param {string} symbol - Player symbol to search for.
 *
 * @returns {object|undefined} Matching player object.
 */
export function getPlayerBySymbol(symbol) {
    return gameState.players.find(
        player =>
            player.symbol === symbol
    );
}


/**
 * Creates a safe player name
 * or returns a fallback value.
 *
 * @param {string} value - Raw player name input.
 * @param {string} fallback - Name used when input is empty.
 *
 * @returns {string} Sanitized player name or fallback.
 */
export function createPlayerName(value, fallback) {
    return sanitizeName(value) || fallback;
}


export function sanitizePlayerName(value) {
    return sanitizeName(value);
}


/**
 * Trims, escapes and limits
 * a player name.
 *
 * @param {string} name - Raw player name.
 *
 * @returns {string} Sanitized player name.
 */
function sanitizeName(name) {
    return escapeHtml(name.trim()).slice(0, 12);
}


/**
 * Escapes HTML-sensitive characters
 * in a text value.
 *
 * @param {string} text - Text to escape.
 *
 * @returns {string} Escaped text.
 */
function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll(`"`, "&quot;")
        .replaceAll("'", "&#039;");
}