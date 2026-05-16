//==================================================
// MAIN.JS
//==================================================
// Entry point of the application.
// Initializes the game, handles startup logic,
// mode selection and connects all core systems.
//
// Responsibilities:
// - Start the application
// - Initialize game mode
// - Setup global event listeners
// - Trigger first render
//==================================================
import { initApp } from "./render.js";

document.addEventListener("DOMContentLoaded", initApp);