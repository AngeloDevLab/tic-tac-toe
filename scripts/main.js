import { initApp } from "./render.js";
import { loadLanguage } from "./i18n/language.js";

document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadLanguage();
        initApp();
    }
);

