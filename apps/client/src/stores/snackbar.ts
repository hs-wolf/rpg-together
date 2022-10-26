import { defineStore, acceptHMRUpdate } from 'pinia';
import { SNACKBAR_STORE } from '~~/constants';
import { ISnack } from '~~/custom-types';

interface IState {
  snacksList: ISnack[];
  snackTimer: number;
  offsetTimer: number;
  waitingSnack: boolean;
}

export const useSnackbarStore = defineStore(SNACKBAR_STORE, {
  state: (): IState => ({
    snacksList: [],
    snackTimer: 2,
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
      this.snacksList.push(snack);
      this.clearSnackList();
    },
    clearSnackList() {
      if (this.waitingSnack || !this.snacksList.length) {
        return;
      }
      this.waitingSnack = true;
      setTimeout(() => {
        this.waitingSnack = false;
        this.snacksList.splice(0, 1);
        if (this.snacksList.length) {
          setTimeout(() => {
            this.clearSnackList();
          }, this.offsetTimer * 1000);
        }
      }, this.snackTimer * 1000);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSnackbarStore, import.meta.hot));
}
