/**
 * Static card — informational widget, no hover interaction.
 * Includes padding.
 */
export const card = "bg-fray-surface rounded-2xl shadow-fray-sm p-6";

/**
 * Interactive card shell — no padding (content sets its own).
 * Apply fray-lift to this element or a parent wrapper.
 * Do NOT add overflow-hidden here; use cardSection for image cards.
 */
export const cardInteractive = "bg-fray-surface rounded-2xl shadow-fray-sm";

/**
 * Card that clips an image at the top.
 * Wrap in a fray-lift div with matching rounded-2xl so the
 * overflow-hidden doesn't clip the orange reveal pseudo-element.
 */
export const cardSection =
  "bg-fray-surface rounded-2xl shadow-fray-sm overflow-hidden";
