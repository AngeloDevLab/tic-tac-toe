import { loadLanguage, toggleLanguage, updateLanguageButton } from "./i18n/language.js";
import { applyTranslations } from "./i18n/applyTranslations.js";

document.addEventListener("DOMContentLoaded", () => {
    loadLanguage();
    applyTranslations();
    updateLanguageButton();

    document.getElementById("language-btn")?.addEventListener("click", () => {
        toggleLanguage();
        updateLanguageButton();
        applyTranslations();
    });
});
