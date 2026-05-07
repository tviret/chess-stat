// ─────────────────────────────────────────
//  Chess Stats — Design Tokens
// ─────────────────────────────────────────

export const colors = {
  c0:  '#FDFDFE',
  c1:  '#F7F9FF',
  c2:  '#EDF2FE',
  c3:  '#DFEAFF',
  c4:  '#D0DFFF',
  c5:  '#BDD1FF',
  c6:  '#A6BFF9',
  c7:  '#87A5EF',
  c8:  '#3D63DD',
  c9:  '#3657C3',
  c10: '#395BC7',
  c11: '#1D2E5C',
} as const;

export const fonts = {
  serif: "'Playfair Display', Georgia, serif",
  sans:  "'Inter', system-ui, sans-serif",
} as const;

export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 20,
  full: 9999,
} as const;

export const shadows = {
  card: '0 6px 24px rgba(61,99,221,.12)',
  search: '0 8px 32px rgba(0,0,0,.25)',
} as const;

// CSS variables string — inject into :root
export const cssVars = `
  --c0: ${colors.c0}; --c1: ${colors.c1}; --c2: ${colors.c2}; --c3: ${colors.c3};
  --c4: ${colors.c4}; --c5: ${colors.c5}; --c6: ${colors.c6}; --c7: ${colors.c7};
  --c8: ${colors.c8}; --c9: ${colors.c9}; --c10: ${colors.c10}; --c11: ${colors.c11};
  --serif: ${fonts.serif};
  --sans: ${fonts.sans};
`;
