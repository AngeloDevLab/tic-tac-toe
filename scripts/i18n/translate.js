import { de } from "./translations/de.js";
import { en } from "./translations/en.js";
import { getLanguage } from "./language.js";

const translations = {
    de,
    en
};


/**
 * Resolves a translation key
 * for the active language.
 *
 * @param {string} key - Dot-separated translation key.
 *
 * @returns {string} Translated text or missing-key label.
 */
export function translate(key) {
    const language = getLanguage();

    const translation =
        key
            .split(".")
            .reduce(
                (
                    current,
                    part
                ) => current?.[part],
                translations[language]
            );

    return (
        translation ??
        `[MISSING: ${key}]`
    );
}