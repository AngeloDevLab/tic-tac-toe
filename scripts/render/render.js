import { appState, SCREENS } from "../state.js";
import { getSetupTemplate, getLoadingTemplate, getGameTemplate } from "./templates/index.js";
import { updateLanguageButton } from "../i18n/language.js";
import { applyTranslations } from "../i18n/applyTranslations.js";
import { translate } from "../i18n/translate.js";
import { initGlobalEvents } from "./events.js";


let loadingTimer = null;


/**
 * Bootstraps the application with an initial loading transition to the setup screen.
 */
export function initApp() {
    startLoadingTransition({
        targetScreen: SCREENS.SETUP,
        duration: 1400,
        label: "loading.title"
    });
}


/**
 * Navigates directly to a screen and re-renders.
 *
 * @param {string} screen - Screen identifier from SCREENS.
 */
export function navigateTo(screen) {
    appState.currentScreen = screen;
    render();
}


/**
 * Shows the loading screen, animates the progress bar, then navigates to the target screen.
 *
 * @param {object} options
 * @param {string} options.targetScreen - Screen to navigate to after loading.
 * @param {number} options.duration - Duration of the loading animation in milliseconds.
 * @param {string} options.label - Translation key for the loading label.
 */
export function startLoadingTransition({ targetScreen, duration, label }) {
    window.clearInterval(loadingTimer);
    appState.currentScreen = SCREENS.LOADING;
    appState.loading.progress = 0;
    render();

    const intervalMs = 35;
    const step = Math.ceil(100 / (duration / intervalMs));

    loadingTimer = window.setInterval(() => {
        appState.loading.progress = Math.min(100, appState.loading.progress + step);
        appState.loading.label = `${translate(label)} ${".".repeat(
            (Math.floor(appState.loading.progress / 20) % 3) + 1
        )}`;

        if (appState.loading.progress >= 100) {
            window.clearInterval(loadingTimer);
            appState.currentScreen = targetScreen;
            render();
            return;
        }

        render();
    }, intervalMs);
}


/**
 * Re-renders the active screen into the main container
 * and rebinds all events and translations.
 */
export function render() {
    const app = document.getElementById("app-main");
    app.innerHTML = getMainTemplate();
    initGlobalEvents();
    applyTranslations();
    updateLanguageButton();
}


function getMainTemplate() {
    if (appState.currentScreen === SCREENS.LOADING) return getLoadingTemplate();
    if (appState.currentScreen === SCREENS.SETUP) return getSetupTemplate();
    if (appState.currentScreen === SCREENS.GAME) return getGameTemplate();
    return "";
}
