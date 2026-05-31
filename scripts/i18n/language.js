import { appState } from "../state.js";

const LANGUAGE_STORAGE_KEY = "language";

/**
 * Returns the currently active language code.
 *
 * @returns {string} Language code (e.g. "en", "de").
 */
export function getLanguage() {
    return appState.language;
}

/**
 * Sets the active language and updates the html lang attribute.
 *
 * @param {string} language - Language code to activate.
 */
export function setLanguage(language) {
    appState.language = language;
    document.documentElement.lang = language;
}

/**
 * Persists the current language to localStorage.
 */
export function saveLanguage() {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, getLanguage());
}

/**
 * Loads and applies the persisted language from localStorage.
 */
export function loadLanguage() {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (savedLanguage) {
        setLanguage(savedLanguage);
    }
}

/**
 * Toggles between "en" and "de" and persists the selection.
 */
export function toggleLanguage() {
    const next = getLanguage() === "en" ? "de" : "en";
    setLanguage(next);
    saveLanguage();
}

/**
 * Updates the language button label to the current language code.
 */
export function updateLanguageButton() {
    const button = document.getElementById("language-label");

    if (!button) {
        return;
    }

    button.textContent = getLanguage().toUpperCase();
}