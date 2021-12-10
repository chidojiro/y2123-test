module.exports = {
  content: ['./**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      padding: {
        full: '100%',
      },
      gridTemplateRows: {
        12: 'repeat(12, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
