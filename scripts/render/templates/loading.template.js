import { appState } from "../../state.js";


/**
 * Returns the loading screen template.
 *
 * @returns {string}
 */
export function getLoadingTemplate() {
    return `
        <section class="loading-screen">
            <div class="loading-card">
                <h1 class="game-title">GameHub</h1>
                <p class="loading-label">${appState.loading.label} ${appState.loading.progress}%</p>
                <div class="loading-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${appState.loading.progress}">
                    <div class="loading-fill" style="width: ${appState.loading.progress}%"></div>
                </div>

            </div>

        </section>
    `;
}