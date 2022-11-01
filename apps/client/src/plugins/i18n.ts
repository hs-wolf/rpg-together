import { createI18n } from 'vue-i18n';
import en from '~~/locales/en.json';
import pt from '~~/locales/pt.json';

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { ['en']: en, ['pt']: pt },
  });
  vueApp.use(i18n);
  return {
    provide: {
      vuei18n: i18n,
    },
  };
});
