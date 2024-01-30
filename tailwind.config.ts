import colors from 'tailwindcss/colors'
import type { Config } from 'tailwindcss'

function withOpacity(variableName: `--${string}`) {
  return `rgb(var(${variableName}))`
}

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sapphire: {
          50: 'rgb(var(--color-sapphire-50) / <alpha-value>)',
          100: 'rgb(var(--color-sapphire-100) / <alpha-value>)',
          200: 'rgb(var(--color-sapphire-200) / <alpha-value>)',
          300: 'rgb(var(--color-sapphire-300) / <alpha-value>)',
          400: 'rgb(var(--color-sapphire-400) / <alpha-value>)',
          500: 'rgb(var(--color-sapphire-500) / <alpha-value>)',
          600: 'rgb(var(--color-sapphire-600) / <alpha-value>)',
          700: 'rgb(var(--color-sapphire-700) / <alpha-value>)',
          800: 'rgb(var(--color-sapphire-800) / <alpha-value>)',
          900: 'rgb(var(--color-sapphire-900) / <alpha-value>)',
          950: 'rgb(var(--color-sapphire-950) / <alpha-value>)',
        }
      },
    },
  },
  plugins: [],
} satisfies Config
