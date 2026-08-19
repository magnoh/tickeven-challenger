/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0E1512',
          soft: '#151E1A',
          line: '#26332C',
        },
        surface: {
          DEFAULT: '#151E1A',
          hover: '#1B2621',
        },
        subtle: '#26332C',
        paper: {
          DEFAULT: '#F6F1E4',
          dim: '#E7E0CC',
        },
        gold: {
          DEFAULT: '#E3B341',
          dim: '#B98F35',
          hover: '#EFC259',
        },
        moss: '#4B5A52',
        text: {
          DEFAULT: '#EDEAE0',
          dim: '#9AA39B',
        },
        muted: '#9AA39B',
      },
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '4px',
      },
    },
  },
  plugins: [],
}

