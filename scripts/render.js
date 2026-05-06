//==================================================
// RENDER.JS
//==================================================
// Handles all UI rendering and DOM updates.
//
// Responsibilities:
// - Render game boards
// - Render symbols and UI elements
// - Update the visual game state
// - Render menus, winner screens and overlays
//
// Only visual logic belongs here.
//==================================================

import { gameState } from "./state.js";

import {
    getLandingPageTemplate,
    getMatchTypeTemplate,
    getGameTemplate
} from "./templates.js";

import {
    selectGameMode,
    selectMatchType
} from "./game.js";


export function render() {

    const app = document.getElementById("app");

    if (gameState.currentScreen === "landing") {
        app.innerHTML = getLandingPageTemplate();
        initLandingPageEvents();
    }

    if (gameState.currentScreen === "match-type") {
        app.innerHTML = getMatchTypeTemplate();
        initMatchTypeEvents();
    }

    if (gameState.currentScreen === "game") {
        app.innerHTML = getGameTemplate();
    }
}

function initLandingPageEvents() {
    document
        .getElementById("classic-btn")
        .addEventListener("click", () => {
            selectGameMode("classic");
        });

    // document
    //     .getElementById("ultimate-btn")
    //     .addEventListener("click", () => {
    //         selectGameMode("ultimate");
    //     });
}


function initMatchTypeEvents() {

    // document
    //     .getElementById("singleplayer-btn")
    //     .addEventListener("click", () => {
    //         selectMatchType("singleplayer");
    //     });

    document
        .getElementById("local-btn")
        .addEventListener("click", () => {
            selectMatchType("local");
        });

    // document
    //     .getElementById("online-btn")
    //     .addEventListener("click", () => {
    //         selectMatchType("online");
    //     });
}