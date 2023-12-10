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
          DEFAULT: '#6f6bf2',
          1: '#7a75f4',
          2: '#8580f4',
        },
        danger: {
          DEFAULT: '#ef4444',
          1: '#f45555',
          2: '#f96666',
        },
        action: {
          DEFAULT: '#22c55e',
          1: '#2ad06a',
          2: '#32db76',
        },
      },
    },
  },
}
