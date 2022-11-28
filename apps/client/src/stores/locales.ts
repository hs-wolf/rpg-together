import { LOCALES_STORE, LOCALE_STORAGE_KEY } from '~/constants';
import { AppDirections, AppLang } from '~/types';
import { useAlertsStore } from '~/stores';

interface IState {
  direction: AppDirections;
  rtlList: AppLang[];
}

export const useLocalesStore = defineStore(LOCALES_STORE, {
  state: (): IState => ({
    direction: AppDirections.LTR,
    rtlList: [],
  }),
  getters: {},
  actions: {
    changeLocale(locale: AppLang) {
      const { locale: currentLocale } = useNuxtApp().$i18n;
      currentLocale.value = locale;
      this.saveLocale(locale);
      return this.rtlList.includes(locale) ? (this.direction = AppDirections.RTL) : (this.direction = AppDirections.LTR);
    },
    saveLocale(locale: string) {
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, locale);
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
    loadLocale() {
      const value = localStorage.getItem(LOCALE_STORAGE_KEY) as AppLang;
      if (value) {
        this.changeLocale(value);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLocalesStore, import.meta.hot));
}
