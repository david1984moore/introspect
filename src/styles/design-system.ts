// Perfect Fourth Typography Scale (1.333 ratio)
export const typography = {
  '3xl': 'text-[3.157rem] leading-[1.1]',  // 50.52px - Hero
  '2xl': 'text-[2.369rem] leading-[1.2]',  // 37.90px - Section
  'xl': 'text-[1.777rem] leading-[1.3]',   // 28.43px - Subsection
  'lg': 'text-[1.333rem] leading-[1.4]',   // 21.33px - Emphasis
  'base': 'text-base leading-[1.6]',       // 16px - Body
  'sm': 'text-[0.875rem] leading-[1.5]',   // 14px - Small
  'xs': 'text-[0.75rem] leading-[1.5]',    // 12px - Fine print
} as const

// 8-point spacing grid
export const spacing = {
  0: '0',
  1: '0.5rem',   // 8px
  2: '1rem',     // 16px
  3: '1.5rem',   // 24px
  4: '2rem',     // 32px
  6: '3rem',     // 48px
  8: '4rem',     // 64px
  12: '6rem',    // 96px
  16: '8rem',    // 128px
} as const

// OKLCH color system for perceptual uniformity
export const colors = {
  primary: 'oklch(58% 0.20 240)',     // Blue
  accent: 'oklch(72% 0.18 160)',      // Teal
  gray: {
    900: 'oklch(15% 0 0)',            // Text
    800: 'oklch(25% 0 0)',
    700: 'oklch(40% 0 0)',
    600: 'oklch(50% 0 0)',
    500: 'oklch(60% 0 0)',
    400: 'oklch(70% 0 0)',
    300: 'oklch(80% 0 0)',
    200: 'oklch(90% 0 0)',
    100: 'oklch(96% 0 0)',            // Background
    50: 'oklch(98% 0 0)',
  },
  success: 'oklch(70% 0.20 140)',
  warning: 'oklch(75% 0.15 80)',
  error: 'oklch(65% 0.25 30)',
} as const

// Apple system font stack
export const fontFamily = {
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
  ].join(', '),
} as const

