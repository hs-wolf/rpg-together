// Keep config file extension as '.js' so the tailwind extension intellisense works properly.
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './apps/client/app.vue',
    './apps/client/src/components/**/*.{js,ts,vue}',
    './apps/client/src/layouts/**/*.{js,ts,vue}',
    './apps/client/src/pages/**/*.{js,ts,vue}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#152026',
          light: '#2A404D',
          dark: '#0E151A',
        },
        secondary: {
          DEFAULT: '#D9D9D9',
          light: '#F2F2F2',
          dark: '#8C8C8C',
        },
        accent: {
          DEFAULT: '#942136',
          light: '#CF2D4B',
          dark: '#57131F',
        },
      },
    },
  },
};
