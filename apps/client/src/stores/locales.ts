import type { SupportedLanguages } from '@rpg-together/models'
import { LOCALES_STORE, LOCALE_STORAGE_KEY } from '~/constants'
import { AppDirections } from '~/types'
import { useAlertsStore } from '~/stores'

interface IState {
  direction: AppDirections
  rtlList: SupportedLanguages[]
}

export const useLocalesStore = defineStore(LOCALES_STORE, {
  state: (): IState => ({
    direction: AppDirections.LTR,
    rtlList: [],
  }),
  getters: {},
  actions: {
    changeLocale(locale: SupportedLanguages) {
      this.saveLocale(locale)
      this.rtlList.includes(locale) ? (this.direction = AppDirections.RTL) : (this.direction = AppDirections.LTR)
      const switchLocalePath = useSwitchLocalePath()
      navigateTo(switchLocalePath(locale))
    },
    saveLocale(locale: SupportedLanguages) {
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
      const value = localStorage.getItem(LOCALE_STORAGE_KEY) as SupportedLanguages
      if (value)
        this.changeLocale(value)
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLocalesStore, import.meta.hot))
