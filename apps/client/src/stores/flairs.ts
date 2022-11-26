import { FLAIRS_STORE } from '~~/constants';
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
    async getAllFlairs() {
      try {
        this.allFlairs = await useRpgTogetherAPI.getAllFlairs();
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFlairsStore, import.meta.hot));
}
