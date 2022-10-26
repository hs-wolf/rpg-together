import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite';

export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', '@pinia/nuxt', '@nuxtjs/tailwindcss', 'nuxt-icons'],
  nitro: {
    output: {
      dir: '../../../../dist/apps/client',
    },
  },
  srcDir: 'src/',
  alias: {
    '@rpg-together/models': resolve(dirname(fileURLToPath(import.meta.url)), '../../libs/models/src/index.ts'),
    '@rpg-together/repos': resolve(dirname(fileURLToPath(import.meta.url)), '../../libs/repos/src/index.ts'),
    '@rpg-together/utils': resolve(dirname(fileURLToPath(import.meta.url)), '../../libs/utils/src/index.ts'),
  },
  runtimeConfig: {
    public: {
      BASE_URL: process.env.BASE_URL ?? 'http://localhost:3000/',
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    cssPath: './src/assets/css/tailwind.css',
    configPath: './tailwind.config.js',
    viewer: false,
  },
  vite: {
    plugins: [
      VueI18nVitePlugin({
        include: [resolve(dirname(fileURLToPath(import.meta.url)), 'locales/*.json')],
      }),
    ],
  },
});
