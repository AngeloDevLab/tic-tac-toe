import { translate } from "./translate.js";


/**
 * Applies translated text
 * to all elements with data-i18n.
 */
export function applyTranslations() {
    const elements = document.querySelectorAll("[data-i18n]");

    elements.forEach(
        (element) => {

            const key =
                element.dataset.i18n;

            element.textContent =
                translate(key);

        }
    );
}