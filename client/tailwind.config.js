/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'surface': '#0E0E0E',
        'surface-dim': '#131313',
        'surface-container-low': '#131313',
        'surface-container': '#1A1A1A',
        'surface-container-high': '#20201F',
        'surface-container-highest': '#262626',
        'primary': '#72FE8F',
        'primary-dim': '#1CB854', // or 'primary-container'
        'on-surface-variant': '#ADAAAA',
        'tertiary': '#88EBFF',
        
        // Also keeping some legacy Spotify colors just in case we missed updating a class
        spotify: {
          green: '#72FE8F', // redirect old green to new neon green
          black: '#0E0E0E',
          white: '#FFFFFF',
          dark: '#121212',
          light: '#282828',
          grey: '#ADAAAA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.5s ease-in-out',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        }
      }
    },
  },
  plugins: [],
}
