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
          DEFAULT: '#0D0D0D',
          light: '#0D0D0D',
          dark: '#0D0D0D',
        },
        secondary: {
          DEFAULT: '#EBEDF2',
          light: '#EBEDF2',
          dark: '#EBEDF2',
        },
        accent: {
          DEFAULT: '#6F6BF2',
          light: '#AAA7F2',
          dark: '#5852F2',
        },
      },
    },
  },
};
