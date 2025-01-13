/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.{html,js}"
  ],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(180deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        flicker: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.4' },
          '100%': { opacity: '1' },
        },
      },

      animation: {
        'spin-slow': 'spin 7s linear infinite',
        'flicker': 'flicker 1.5s infinite'
      },
    },
  },
  plugins: [],
}

