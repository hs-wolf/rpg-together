import type { Flair } from '@rpg-together/models'
import { FlairTypes, SupportedLanguages } from '@rpg-together/models'
import { FLAIRS_STORE } from '~/constants'
import { useAlertsStore } from '~/stores'
import type { AdvancedSelectOption } from '~/types'

interface IState {
  allFlairs: Flair[]
}

export const useFlairsStore = defineStore(FLAIRS_STORE, {
  state: (): IState => ({ allFlairs: [] }),
  getters: {
    systemsFlairs(state) {
      return state.allFlairs.filter(flair => flair.type === FlairTypes.SYSTEM)
    },
    languagesFlairs(state) {
      return state.allFlairs.filter(flair => flair.type === FlairTypes.LANGUAGES)
    },
    ratingsFlairs(state) {
      return state.allFlairs.filter(flair => flair.type === FlairTypes.RATINGS)
    },
    vacanciesFlairs(state) {
      return state.allFlairs.filter(flair => flair.type === FlairTypes.VACANCIES)
    },
    genresFlairs(state) {
      return state.allFlairs.filter(flair => flair.type === FlairTypes.GENRES)
    },
  },
  actions: {
    async fetchAllFlairs(options?: { save: boolean }) {
      try {
        const flairs = await useRpgTogetherAPI.fetchAllFlairs()
        if (options?.save)
          this.allFlairs = flairs

        return flairs
      }
      catch (error) {
        useAlertsStore().handleError(error)
      }
    },
    mapFlairsToAdvancedSelectOption(flairs: Flair[]) {
      try {
        const { locale } = useNuxtApp().$i18n
        const advancedSelectOptions: AdvancedSelectOption[] = flairs.map((flair) => {
          return { id: flair.id, name: flair.name, label: flair.labels[locale.value as SupportedLanguages] ?? flair.labels[SupportedLanguages.EN] }
        })
        return advancedSelectOptions
      }
      catch (error) {
        useAlertsStore().handleError(error)
        return []
      }
    },
    getFlairLabel(flairId: string) {
      try {
        const { locale } = useNuxtApp().$i18n
        const flair = this.allFlairs.find(flair => flair.id === flairId)
        return flair?.labels[locale.value as SupportedLanguages] ?? flair?.labels[SupportedLanguages.EN]
      }
      catch (error) {
        useAlertsStore().handleError(error)
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useFlairsStore, import.meta.hot))
