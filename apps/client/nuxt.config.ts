import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import VueI18nVitePlugin from '@intlify/unplugin-vue-i18n/vite';

export default defineNuxtConfig({
  typescript: { shim: false },
  nitro: {
    output: {
      dir: '~~/../../dist/apps/nuxt-app',
    },
  },
  srcDir: 'src/',
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Rpg Together',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Rpg Together' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt', 'nuxt-icons'],
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
});
