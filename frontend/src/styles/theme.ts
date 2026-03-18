// Mirror of @theme tokens in main.css — keep in sync.
// Use these only where JS-level color values are required (e.g. dynamic styles).
// All static Tailwind classes should use the named tokens (e.g. text-fray-primary).
export const colors = {
  primary:        '#e8621a',
  primaryHover:   '#cf5115',
  ink:            '#0d0c0b',
  text:           '#f5f0eb',
  textLight:      '#c4b8ac',
  textFaint:      '#7a6e66',
  muted:          '#6b5f57',
  success:        '#7dab6e',
  danger:         '#c0392b',
  bg:             '#111010',
  glass:          'rgba(232, 98, 26, 0.06)',
  overlay:        'rgba(20, 14, 10, 0.95)',
  inputBg:        'rgba(255, 255, 255, 0.04)',
  navBg:          'rgba(15, 13, 12, 0.85)',
  border:         'rgba(232, 98, 26, 0.18)',
  borderHover:    'rgba(232, 98, 26, 0.40)',
  borderSubtle:   'rgba(232, 98, 26, 0.12)',
};

export const spacing = {
  xs:  '6px',
  sm:  '10px',
  md:  '15px',
  lg:  '20px',
  xl:  '30px',
  xxl: '100px',
};

export const font = {
  sm:   '0.85rem',
  base: '1rem',
  md:   '1.2rem',
  lg:   '1.5rem',
  xl:   '2.4rem',
};

export const radius = {
  sm:  '6px',
  md:  '12px',
  lg:  '20px',
};

export const layout = {
  navHeight: '60px',
};
