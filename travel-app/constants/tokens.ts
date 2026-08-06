/**
 * Itinerate Design Tokens
 * Aligned with docs/01-design-system/04 - Design Tokens.md
 *
 * Every UI value MUST come from here — never use arbitrary numbers.
 */

// ─── Colors ───────────────────────────────────────────────
export const Colors = {
  // Primary Brand (Blue)
  blue50: '#EFF6FF',
  blue100: '#DBEAFE',
  blue200: '#BFDBFE',
  blue300: '#93C5FD',
  blue400: '#60A5FA',
  blue500: '#2563EB', // Primary
  blue600: '#1D4ED8',
  blue700: '#1E40AF',
  blue800: '#1E3A8A',
  blue900: '#172554',

  // Secondary Brand (Teal)
  teal50: '#F0FDFA',
  teal100: '#CCFBF1',
  teal200: '#99F6E4',
  teal300: '#5EEAD4',
  teal400: '#2DD4BF',
  teal500: '#14B8A6',
  teal600: '#0D9488',
  teal700: '#0F766E',

  // Accent
  orange500: '#F97316',

  // Semantic
  success: '#16A34A',
  warning: '#FACC15',
  danger: '#DC2626',
  information: '#2563EB',
  offline: '#64748B',

  // Neutral
  white: '#FFFFFF',
  surface: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  divider: '#E5E7EB',
  disabledBg: '#F1F5F9',
  primaryText: '#111827',
  secondaryText: '#6B7280',
  placeholder: '#94A3B8',
  disabledText: '#CBD5E1',
} as const;

// ─── Gradients ────────────────────────────────────────────
export const Gradients = {
  primary: [Colors.blue500, Colors.teal500] as const,        // Auth, hero, splash
  adventure: [Colors.teal500, '#22C55E'] as const,           // Trekking
  sunrise: [Colors.orange500, '#FB923C'] as const,           // Destinations
} as const;

// ─── Typography ───────────────────────────────────────────
export const Typography = {
  family: 'Inter',
  fallback: 'System',

  displayXL: { fontSize: 40, fontWeight: '700' as const, lineHeight: 48 },
  displayL:  { fontSize: 34, fontWeight: '700' as const, lineHeight: 40.8 },
  headingXL: { fontSize: 30, fontWeight: '600' as const, lineHeight: 39 },
  headingL:  { fontSize: 26, fontWeight: '600' as const, lineHeight: 33.8 },
  headingM:  { fontSize: 22, fontWeight: '600' as const, lineHeight: 28.6 },
  headingS:  { fontSize: 20, fontWeight: '500' as const, lineHeight: 26 },
  bodyLarge: { fontSize: 18, fontWeight: '400' as const, lineHeight: 27 },
  body:      { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 21 },
  caption:   { fontSize: 12, fontWeight: '400' as const, lineHeight: 16.8 },
  micro:     { fontSize: 10, fontWeight: '500' as const, lineHeight: 14 },
} as const;

// ─── Spacing (8pt grid) ──────────────────────────────────
export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
  '3xl': 48,
  '4xl': 64,
  '5xl': 80,
} as const;

// ─── Border Radius ────────────────────────────────────────
export const Radius = {
  xs: 8,
  s: 12,
  m: 16,
  l: 20,
  xl: 24,
  xxl: 32,
  circular: 999,
} as const;

// ─── Shadows ──────────────────────────────────────────────
export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  fab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  dialog: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 10,
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

// ─── Opacity ──────────────────────────────────────────────
export const Opacity = {
  disabled: 0.38,
  placeholder: 0.60,
  pressed: 0.80,
  overlay: 0.40,
  scrim: 0.60,
} as const;

// ─── Component Sizes ──────────────────────────────────────
export const ButtonSize = {
  small: 40,
  medium: 48,
  primary: 56,
  largeCTA: 64,
  radius: 18,
} as const;

export const InputSize = {
  height: 56,
  radius: 18,
  padding: 16,
  iconSize: 24,
} as const;

export const AvatarSize = {
  xs: 24,
  s: 32,
  m: 40,
  l: 56,
  xl: 72,
  hero: 96,
} as const;

export const IconSize = {
  small: 20,
  primary: 24,
  large: 32,
  hero: 48,
  feature: 56,
  illustration: 96,
} as const;
