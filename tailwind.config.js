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
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
