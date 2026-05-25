import { gameState } from "../state.js";

export function getPlayerBySymbol(symbol) {
    return gameState.players.find(
        player =>
            player.symbol === symbol
    );
}

export function createPlayerName(value, fallback) {
    return sanitizeName(value) || fallback;
}

function sanitizeName(name) {
    return escapeHtml(name.trim()).slice(0, 12);
}

function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll(`"`, "&quot;")
        .replaceAll("'", "&#039;");
}