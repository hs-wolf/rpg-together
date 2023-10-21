import { LOCALES_STORE, LOCALE_STORAGE_KEY } from '~/constants'
import type { AppLang } from '~/types'
import { AppDirections } from '~/types'
import { useAlertsStore } from '~/stores'

interface IState {
  direction: AppDirections
  rtlList: AppLang[]
}

export const useLocalesStore = defineStore(LOCALES_STORE, {
  state: (): IState => ({
    direction: AppDirections.LTR,
    rtlList: [],
  }),
  getters: {},
  actions: {
    changeLocale(locale: AppLang) {
      this.saveLocale(locale)
      this.rtlList.includes(locale) ? (this.direction = AppDirections.RTL) : (this.direction = AppDirections.LTR)
      const switchLocalePath = useSwitchLocalePath()
      navigateTo(switchLocalePath(locale))
    },
    saveLocale(locale: AppLang) {
      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, locale)
        const auth = useFirebase.firebaseAuth()
        if (auth.value)
          auth.value.languageCode = locale
      }
      catch (error) {
        useAlertsStore().handleError(error)
      }
    },
    loadLocale() {
      const value = localStorage.getItem(LOCALE_STORAGE_KEY) as AppLang
      if (value)
        this.changeLocale(value)
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLocalesStore, import.meta.hot))
