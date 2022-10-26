import { defineStore, acceptHMRUpdate } from 'pinia';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { USER_STORE } from '~~/constants';
import { useAlertsStore } from '~/stores';
import { User } from '@rpg-together/models';

interface IState {
  user: User | null;
  signingIn: boolean;
  signingOut: boolean;
  authChecked: boolean;
}

export const useUserStore = defineStore(USER_STORE, {
  state: (): IState => ({
    user: null,
    signingIn: false,
    signingOut: false,
    authChecked: false,
  }),
  getters: {},
  actions: {
    async signIn(email: string, password: string) {
      try {
        if (this.signingIn) {
          return;
        }
        this.signingIn = true;
        const nuxtApp = useNuxtApp();
        await signInWithEmailAndPassword(nuxtApp.$firebaseAuth, email, password);
      } catch (error) {
        useAlertsStore().handleError(error);
      } finally {
        this.signingIn = false;
      }
    },
    async signOut() {
      try {
        if (this.signingOut) {
          return;
        }
        this.signingOut = true;
        const nuxtApp = useNuxtApp();
        await signOut(nuxtApp.$firebaseAuth);
      } catch (error) {
        useAlertsStore().handleError(error);
      } finally {
        this.signingOut = false;
      }
    },
    async register() {
      // TODO: Register API logic.
    },
    async fetchUser(userId: string) {
      try {
        const { data } = await useRpgTogetherAPI.fetchUser({ userId });
        this.user = data.value;
        return this.user;
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
