import { FLAIRS_STORE } from '~/constants';
import { useAlertsStore } from '~/stores';
import { Flair, FlairTypes } from '@rpg-together/models';

interface IState {
  allFlairs: Flair[];
}

export const useFlairsStore = defineStore(FLAIRS_STORE, {
  state: (): IState => ({ allFlairs: [] }),
  getters: {
    systemsFlairs(state) {
      const { locale } = useNuxtApp().$i18n;
      return state.allFlairs
        .filter((flair) => flair.type === FlairTypes.SYSTEM)
        .map((flair) => {
          return { id: flair.id, name: flair.name, label: flair.labels[locale.value] };
        });
    },
    languagesFlairs(state) {
      const { locale } = useNuxtApp().$i18n;
      return state.allFlairs
        .filter((flair) => flair.type === FlairTypes.LANGUAGES)
        .map((flair) => {
          return { id: flair.id, name: flair.name, label: flair.labels[locale.value] };
        });
    },
    ratingsFlairs(state) {
      const { locale } = useNuxtApp().$i18n;
      return state.allFlairs
        .filter((flair) => flair.type === FlairTypes.RATINGS)
        .map((flair) => {
          return { id: flair.id, name: flair.name, label: flair.labels[locale.value] };
        });
    },
    vacanciesFlairs(state) {
      const { locale } = useNuxtApp().$i18n;
      return state.allFlairs
        .filter((flair) => flair.type === FlairTypes.VACANCIES)
        .map((flair) => {
          return { id: flair.id, name: flair.name, label: flair.labels[locale.value] };
        });
    },
    genresFlairs(state) {
      const { locale } = useNuxtApp().$i18n;
      return state.allFlairs
        .filter((flair) => flair.type === FlairTypes.GENRES)
        .map((flair) => {
          return { id: flair.id, name: flair.name, label: flair.labels[locale.value] };
        });
    },
  },
  actions: {
    async fetchAllFlairs(options?: { save: boolean }) {
      try {
        const flairs = await useRpgTogetherAPI.fetchAllFlairs();
        if (options?.save) {
          this.allFlairs = flairs;
        }
        return flairs;
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
    getFlairLabel(flairId: string) {
      try {
        const { locale } = useNuxtApp().$i18n;
        return this.allFlairs.find((flair) => flair.id === flairId)?.labels[locale.value];
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFlairsStore, import.meta.hot));
}
