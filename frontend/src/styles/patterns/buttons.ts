const base =
  "font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

/** Solid orange — primary action */
export const btnPrimary = `${base} px-5 py-2.5 bg-fray-primary text-fray-ink text-sm rounded-xl shadow-fray-sm hover:bg-fray-primary-hover hover:-translate-y-0.5 hover:shadow-fray-md`;

/** White background — secondary/cancel action */
export const btnSecondary = `${base} px-5 py-2.5 bg-fray-surface text-fray-text-light text-sm rounded-xl shadow-fray-sm hover:text-fray-text hover:-translate-y-0.5 hover:shadow-fray-md`;

/** Transparent — low-emphasis action (e.g. avatar buttons, edit rows) */
export const btnGhost = `${base} px-4 py-1.5 text-fray-text-faint text-xs rounded-lg hover:bg-fray-surface-alt hover:text-fray-text`;

/** Transparent — destructive low-emphasis action */
export const btnDanger = `${base} px-4 py-1.5 text-fray-text-faint text-xs rounded-lg hover:bg-fray-surface-alt hover:text-fray-danger`;
