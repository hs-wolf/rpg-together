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
      colors: {},
    },
  },
};
