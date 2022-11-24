import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { USER_STORE } from '~~/constants';
import { SnackType } from '~~/custom-types';
import { useAlertsStore, useSnackbarStore } from '~/stores';
import { User, AuthUserRegisterBody } from '@rpg-together/models';

interface IState {
  user: User | null;
  signingIn: boolean;
  signingOut: boolean;
  registering: boolean;
  authChecked: boolean;
}

export const useUserStore = defineStore(USER_STORE, {
  state: (): IState => ({
    user: null,
    signingIn: false,
    signingOut: false,
    registering: false,
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
    async register(body: AuthUserRegisterBody) {
      if (this.registering) {
        return;
      }
      this.registering = true;
      try {
        await useRpgTogetherAPI.register({ body });
        useSnackbarStore().createSnack({
          message: useNuxtApp().$vuei18n.global.t('user-store.success.register'),
          type: SnackType.SUCCESS,
        });
        await this.signIn(body.email, body.password);
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          message: useNuxtApp().$vuei18n.global.t('user-store.error.register'),
          type: SnackType.ERROR,
        });
      } finally {
        this.registering = false;
      }
    },
    async fetchUser(userId: string) {
      try {
        this.user = await useRpgTogetherAPI.fetchUser({ userId });
        return this.user;
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          message: useNuxtApp().$vuei18n.global.t('user-store.error.fetch-user'),
          type: SnackType.ERROR,
        });
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
