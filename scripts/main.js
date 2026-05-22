import { initApp } from "./render.js";
import { getLanguage, setLanguage } from "./i18n/language.js";
import { translate } from "./i18n/translate.js";

document.addEventListener("DOMContentLoaded", initApp);

console.log(getLanguage());
setLanguage("de");
document.getElementById("help-btn").lastChild.textContent =
    translate("header.help");
console.log(getLanguage());
console.log(translate("header.help"));