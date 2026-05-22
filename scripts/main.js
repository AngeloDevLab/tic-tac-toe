import { initApp } from "./render.js";
import { appState, gameState } from "./state.js";

document.addEventListener("DOMContentLoaded", initApp);

console.log(appState.language);
console.log(gameState);