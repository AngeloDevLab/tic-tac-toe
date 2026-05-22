import { appState } from "../state.js";

const LANGUAGE_STORAGE_KEY = "language";

export function getLanguage() {
    return appState.language;
}

export function setLanguage(language) {
    appState.language = language;
}

export function saveLanguage() {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, getLanguage());
}

export function loadLanguage() {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (savedLanguage) {
        setLanguage(savedLanguage);
    }
}

export function updateLanguageButton() {
    const button = document.getElementById("language-label");

    if (!button) {
        return;
    }

    button.textContent =getLanguage().toUpperCase();
}