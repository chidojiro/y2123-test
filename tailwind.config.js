const MAX_SUPPORTED_UNIT = 320;
const STEP = 0.5;
const REM_PER_UNIT = 0.25;

const generatedExtendedSize = new Array(MAX_SUPPORTED_UNIT / STEP).fill(null).reduce((acc, _, idx) => {
  return {
    ...acc,
    [(idx + 1) * STEP]: `${(idx + 1) * STEP * REM_PER_UNIT}rem`,
  };
}, {});

const extendedSize = {
  ...generatedExtendedSize,
  fit: 'fit-content',
  full: '100%',
  '2/3': '66.67%',
  '3/4': '75%',
  '9/10': '90%',
  '9/16': '56.25%',
  '15/16': `${(15 * 100) / 16}%`,
  '1/2-screen': '50vh',
};

module.exports = {
  content: ['./**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class',
  theme: {
    extend: {
      width: extendedSize,
      height: { ...extendedSize, viewport: 'var(--view-port-height)' },
      maxWidth: extendedSize,
      maxHeight: { ...extendedSize, viewport: 'var(--view-port-height)' },
      minWidth: extendedSize,
      minHeight: { ...extendedSize, viewport: 'var(--view-port-height)' },
      padding: extendedSize,
      paddingTop: extendedSize,
      paddingBottom: extendedSize,
      paddingLeft: extendedSize,
      paddingRight: extendedSize,
      margin: extendedSize,
      marginTop: extendedSize,
      marginBottom: extendedSize,
      marginLeft: extendedSize,
      marginRight: extendedSize,
    },
  },
  plugins: [],
};
