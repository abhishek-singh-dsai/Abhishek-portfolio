/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

const config = {
  content: ['./src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: token('background'),
        foreground: token('foreground'),
        card: token('card'),
        muted: token('muted'),
        'muted-foreground': token('muted-foreground'),
        accent: token('accent'),
        primary: token('primary'),
        'primary-foreground': token('primary-foreground'),
        destructive: token('destructive'),
        ring: token('ring'),
        status: token('status'),
        g1: token('g1'),
        g2: token('g2'),
        g3: token('g3'),
        // Borders carry their own alpha in dark mode (white at 10%).
        border: 'rgb(var(--border) / calc(var(--border-alpha) * <alpha-value>))',
        input: 'rgb(var(--border) / calc(var(--input-alpha) * <alpha-value>))',
      },
      // Font variables come from next/font in src/app/layout.jsx
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        'serif-display': ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      transitionTimingFunction: {
        'out-strong': 'cubic-bezier(.23, 1, .32, 1)',
        'in-out-strong': 'cubic-bezier(.77, 0, .175, 1)',
        drawer: 'cubic-bezier(.32, .72, 0, 1)',
      },
      keyframes: {
        ping: { '75%, 100%': { transform: 'scale(2)', opacity: '0' } },
      },
    },
  },
  plugins: [],
};

export default config;
