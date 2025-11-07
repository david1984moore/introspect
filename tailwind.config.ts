import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'oklch(58% 0.20 240)',
        accent: 'oklch(72% 0.18 160)',
        gray: {
          50: 'oklch(98% 0 0)',
          100: 'oklch(96% 0 0)',
          200: 'oklch(90% 0 0)',
          300: 'oklch(80% 0 0)',
          400: 'oklch(70% 0 0)',
          500: 'oklch(60% 0 0)',
          600: 'oklch(50% 0 0)',
          700: 'oklch(40% 0 0)',
          800: 'oklch(25% 0 0)',
          900: 'oklch(15% 0 0)',
        },
        success: 'oklch(70% 0.20 140)',
        warning: 'oklch(75% 0.15 80)',
        error: 'oklch(65% 0.25 30)',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        '3xl': ['3.157rem', { lineHeight: '1.1' }], // 50.52px - Hero
        '2xl': ['2.369rem', { lineHeight: '1.2' }], // 37.90px - Section
        'xl': ['1.777rem', { lineHeight: '1.3' }], // 28.43px - Subsection
        'lg': ['1.333rem', { lineHeight: '1.4' }], // 21.33px - Emphasis
        base: ['1rem', { lineHeight: '1.6' }], // 16px - Body
        sm: ['0.875rem', { lineHeight: '1.5' }], // 14px - Small
        xs: ['0.75rem', { lineHeight: '1.5' }], // 12px - Fine print
      },
      spacing: {
        0: '0',
        1: '0.5rem', // 8px
        2: '1rem', // 16px
        3: '1.5rem', // 24px
        4: '2rem', // 32px
        6: '3rem', // 48px
        8: '4rem', // 64px
        12: '6rem', // 96px
        16: '8rem', // 128px
      },
    },
  },
  plugins: [],
}
export default config

