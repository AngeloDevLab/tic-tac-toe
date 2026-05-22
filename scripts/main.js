import { initApp } from "./render.js";
import { getLanguage, setLanguage } from "./i18n/language.js";
import { translate } from "./i18n/translate.js";
import { applyTranslations } from "./i18n/applyTranslations.js";
import { loadLanguage } from "./i18n/language.js";

document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadLanguage();
        initApp();
    }
);

