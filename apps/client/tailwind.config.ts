import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './apps/client/src/{App,app,Error,error}.vue',
    './apps/client/src/{components,layouts,pages,composables,plugins}/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          1: '#0d0d0d',
          2: '#191919',
        },
        secondary: {
          DEFAULT: '#ffffff',
          1: '#f2f2f2',
          2: '#e6e6e6',
        },
        accent: {
          DEFAULT: '#3D34EF',
          1: '#675FF7',
          2: '#908AFF',
        },
        danger: {
          DEFAULT: '#B21010',
          1: '#C74646',
          2: '#DB7B7B',
        },
        action: {
          DEFAULT: '#0C642B',
          1: '#208940',
          2: '#34AD54',
        },
        warning: {
          DEFAULT: '#C09207',
          1: '#987407',
          2: '#6F5506',
        },
      },
    },
  },
}
