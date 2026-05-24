

export function getPlayerInput({ id, label, placeholder, value = "", disabled = false }) {
    return `
        <div class="input-group">
            <label class="label" for="${id}">
                ${label}
            </label>

            <input
                id="${id}"
                class="input"
                value="${value}"
                placeholder="${placeholder}"
                ${disabled ? "disabled" : ""}
            >
        </div>
    `;
}