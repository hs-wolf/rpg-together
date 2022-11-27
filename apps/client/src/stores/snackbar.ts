import { SNACKBAR_STORE } from '~/constants';
import { ISnack } from '~/types';

interface IState {
  snacksList: ISnack[];
  snackTimer: number;
  offsetTimer: number;
  waitingSnack: boolean;
  currentTimeOut?: NodeJS.Timeout;
}

export const useSnackbarStore = defineStore(SNACKBAR_STORE, {
  state: (): IState => ({
    snacksList: [],
    snackTimer: 5,
    offsetTimer: 1,
    waitingSnack: false,
  }),
  getters: {
    currentSnack(state) {
      return state.snacksList[0];
    },
  },
  actions: {
    createSnack(snack: ISnack) {
      const { t } = useNuxtApp().$i18n;
      this.snacksList.push({ ...snack, message: t(snack.message) });
      this.clearSnackList();
    },
    clearSnackList() {
      if (this.waitingSnack || !this.snacksList.length) {
        return;
      }
      this.waitingSnack = true;
      this.currentTimeOut = setTimeout(this.clearCurrentSnack, this.snackTimer * 1000);
    },
    clearCurrentSnack() {
      clearTimeout(this.currentTimeOut);
      this.waitingSnack = false;
      this.snacksList.splice(0, 1);
      if (this.snacksList.length) {
        setTimeout(() => {
          this.clearSnackList();
        }, this.offsetTimer * 1000);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSnackbarStore, import.meta.hot));
}
