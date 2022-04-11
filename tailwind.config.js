module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      default: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
    extend: {
      colors: {
        main: '#232323',
        lightMain: '#2E2E31',
        canvas: '#383838',
        lightCanvas: '#636363',
        badge: '#121212',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
