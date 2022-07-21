module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layout/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  variants: {
    extend: {
      ringColor: ['focus-visible'],
      ringOffsetWidth: ['focus-visible'],
      ringWidth: ['focus-visible'],
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
  ],
};
