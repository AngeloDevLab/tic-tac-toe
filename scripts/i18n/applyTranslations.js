import { translate } from "./translate.js";

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