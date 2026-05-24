import { de } from "./translations/de.js";
import { en } from "./translations/en.js";
import { getLanguage } from "./language.js";

const translations = {
    de,
    en
};

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