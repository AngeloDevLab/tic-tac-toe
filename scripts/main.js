import { initApp } from "./render.js";
import { getLanguage, setLanguage } from "./i18n/language.js";

document.addEventListener("DOMContentLoaded", initApp);

console.log(getLanguage());

setLanguage("de");

console.log(getLanguage());