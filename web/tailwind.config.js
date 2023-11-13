/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        btn: {
          background: 'hsl(var(--btn-background))',
          'background-hover': 'hsl(var(--btn-background-hover))',
        },
        primary: {
          '50': '#fff2f1',
          '100': '#ffe2e1',
          '200': '#ffcac7',
          '300': '#ffa4a0',
          '400': '#ff716a',
          '500': '#f8443b',
          '600': '#e6281f',
          '700': '#c11c14',
          '800': '#a01a14',
          '900': '#841d18',
          '950': '#480a07',
        },
      },
    },
  },
  plugins: [],
}
