/**
 * Renders a selectable option button.
 *
 * @param {string} label - Visible button text.
 * @param {string} value - Internal button value.
 * @param {boolean} isSelected - Selection state.
 * @param {string} type - Option category.
 * @param {boolean} isDisabled
 *
 * @returns {string} HTML button template.
 */
export function renderSelectableButton({
    label,
    value,
    dataKey,
    isSelected = false,
    disabled = false
}) {

    return `
        <button
            class="
                btn
                btn-secondary
                ${isSelected ? "is-selected" : ""}
            "

            data-${dataKey}="${value}"
            aria-pressed="${isSelected}"

            ${disabled
                ? "disabled"
                : ""
            }
        >

            ${label}

        </button>
    `;
}