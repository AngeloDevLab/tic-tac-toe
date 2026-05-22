import { appState } from "../state.js";

export function getLanguage() {
    return appState.language;
}

export function setLanguage(language) {
    appState.language = language;
}