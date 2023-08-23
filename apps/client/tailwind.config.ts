import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D0D0D',
          light: '#3A3A3A',
          dark: '#000000',
        },
        secondary: {
          DEFAULT: '#EBEDF2',
          light: '#FFFFFF',
          dark: '#BABBBF',
        },
        accent: {
          DEFAULT: '#6F6BF2',
          light: '#AAA7F2',
          dark: '#5852F2',
        },
        danger: {
          DEFAULT: '#EF233C',
          light: '#FE6D73',
          dark: '#D90429',
        },
      },
    },
  },
}
