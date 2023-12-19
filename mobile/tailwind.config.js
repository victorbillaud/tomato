/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f1',
          100: '#ffe0e0',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6969', // received msg
          500: '#fa3939',
          600: '#e71b1b',
          700: '#c31212',
          800: '#a11313',
          900: '#861717', // sent msg
          950: '#490606',
        },
      },
    },
  },
  plugins: [],
};
