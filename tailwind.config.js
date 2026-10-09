/** @type {import('tailwindcss').Config} */
// Sistema "Organic" del handoff Paper City (notes/design_handoff_paper_city/README.md).
// Los colores default de Tailwind se reemplazan a propósito: solo existe esta paleta.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', './content/v2/**/*.ts'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      bg: '#f5ead8',
      surface: '#ebddc5',
      ink: '#201e1d',
      accent: {
        DEFAULT: '#c67139',
        100: '#fff2eb', 200: '#ffe1d0', 300: '#ffc6a5', 400: '#f6a06b', 500: '#d67f48',
        600: '#b2622d', 700: '#8c491a', 800: '#643312', 900: '#402310',
      },
      sage: {
        DEFAULT: '#7a8a5e',
        100: '#f0fae1', 200: '#e1eecc', 300: '#ccdbb2', 400: '#aebf92', 500: '#8fa073',
        600: '#728157', 700: '#56633f', 800: '#3d472b', 900: '#272e1b',
      },
      neutral: {
        100: '#f9f4ed', 200: '#eee7db', 300: '#dcd3c4', 400: '#c0b6a5', 500: '#a19786',
        600: '#82796a', 700: '#645c50', 800: '#474238', 900: '#2e2b25',
      },
    },
    fontFamily: {
      display: ['Caprasimo', 'Georgia', 'serif'],
      sans: ['Figtree', 'system-ui', 'sans-serif'],
      mono: ['ui-monospace', 'Menlo', 'monospace'],
    },
    borderRadius: {
      none: '0',
      sm: '8px',
      DEFAULT: '8px',
      md: '16px',
      lg: '28px',
      inset: '22px',
      full: '999px',
      cap: '40px 40px 0 0',
    },
    extend: {
      boxShadow: {
        sm: '0 1px 2px rgb(46 43 37 / 0.14)',
        md: '0 3px 10px rgb(46 43 37 / 0.16)',
        lg: '0 12px 32px rgb(46 43 37 / 0.22)',
        frame: '0 12px 32px rgb(46 43 37 / 0.3)',
      },
      spacing: { gutter: 'clamp(18px, 4vw, 56px)' },
      transitionTimingFunction: {
        paper: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        rise: 'cubic-bezier(0.2, 0.9, 0.1, 1)',
      },
    },
  },
  plugins: [],
}
