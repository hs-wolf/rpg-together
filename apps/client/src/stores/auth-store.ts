import { defineStore, acceptHMRUpdate } from 'pinia';
import { AUTH_STORE } from '~~/constants';

interface IState {}

export const useAuthStore = defineStore(AUTH_STORE, {
  state: (): IState => ({}),
  getters: {},
  actions: {},
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
