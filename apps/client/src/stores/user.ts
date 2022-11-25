import { FetchError } from 'ofetch';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, signOut, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { USER_STORE } from '~~/constants';
import { SnackType } from '~~/custom-types';
import { useAlertsStore, useSnackbarStore } from '~/stores';
import { User, AuthUserRegisterBody, UserUpdateBody, ResponseMessages, AuthUserUpdateBody } from '@rpg-together/models';
import { DEFAULT_USER_AVATAR_NAME } from '@rpg-together/utils';

interface IState {
  authChecked: boolean;
  user: User | null;
  signingIn: boolean;
  signingOut: boolean;
  registering: boolean;
  changingAuthData: boolean;
  deletingAccount: boolean;
  changingUsername: boolean;
  changingAvatar: boolean;
}

export const useUserStore = defineStore(USER_STORE, {
  state: (): IState => ({
    authChecked: false,
    user: null,
    signingIn: false,
    signingOut: false,
    registering: false,
    changingAuthData: false,
    deletingAccount: false,
    changingUsername: false,
    changingAvatar: false,
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
    async changeAuthData(values: { password: string; newEmail?: string; newPassword?: string }) {
      try {
        if (this.changingAuthData) {
          return;
        }
        this.changingAuthData = true;
        const firebaseUser = useFirebase.user();
        if (!firebaseUser.value) {
          return;
        }
        const emailCred = EmailAuthProvider.credential(firebaseUser.value.email ?? '', values.password);
        await reauthenticateWithCredential(firebaseUser.value, emailCred);
        const body: AuthUserUpdateBody = {
          password: values.newPassword,
          email: values.newEmail,
        };
        await useRpgTogetherAPI.updateAuthUser({ body });
        const newUser = await useRpgTogetherAPI.updateUser({
          body: { email: values.newEmail ?? firebaseUser.value.email ?? '' },
        });
        this.user = newUser;
        await this.signIn(values.newEmail ?? firebaseUser.value.email ?? '', values.newPassword ?? values.password);
        useSnackbarStore().createSnack({
          message: useNuxtApp().$i18n.t('user-store.success.change-auth-data'),
          type: SnackType.SUCCESS,
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          message: useNuxtApp().$i18n.t('user-store.error.change-auth-data'),
          type: SnackType.ERROR,
        });
        if (error instanceof FirebaseError) {
          return useNuxtApp().$i18n.t(`firebase-errors.${error.code}`) as string;
        }
        if (Object.values(ResponseMessages).includes((error as FetchError).data.message)) {
          return useNuxtApp().$i18n.t(`api-errors.${(error as FetchError).data.message}`) as string;
        }
      } finally {
        this.changingAuthData = false;
      }
    },
    async accountDelete(password: string) {
      try {
        if (this.deletingAccount) {
          return;
        }
        this.deletingAccount = true;
        const firebaseUser = useFirebase.user();
        if (!firebaseUser.value) {
          return;
        }
        const emailCred = EmailAuthProvider.credential(firebaseUser.value.email ?? '', password);
        await reauthenticateWithCredential(firebaseUser.value, emailCred);
        await useRpgTogetherAPI.accountDelete();
        await this.signOut();
        useSnackbarStore().createSnack({
          message: useNuxtApp().$i18n.t('user-store.success.account-delete'),
          type: SnackType.SUCCESS,
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          message: useNuxtApp().$i18n.t('user-store.error.account-delete'),
          type: SnackType.ERROR,
        });
        if (error instanceof FirebaseError) {
          return useNuxtApp().$i18n.t(`firebase-errors.${error.code}`) as string;
        }
        if (Object.values(ResponseMessages).includes((error as FetchError).data.message)) {
          return useNuxtApp().$i18n.t(`api-errors.${(error as FetchError).data.message}`) as string;
        }
      } finally {
        this.deletingAccount = false;
      }
    },
    async fetchUser(userId: string, options?: { save?: boolean }) {
      try {
        const user = await useRpgTogetherAPI.fetchUser({ userId });
        if (options?.save) {
          this.user = user;
        }
        return user;
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          message: useNuxtApp().$vuei18n.global.t('user-store.error.fetch-user'),
          type: SnackType.ERROR,
        });
      }
    },
    async changeUsername(values: { username: string; password: string }) {
      try {
        if (this.changingUsername) {
          return;
        }
        this.changingUsername = true;
        const firebaseUser = useFirebase.user();
        if (!firebaseUser.value) {
          return;
        }
        const emailCred = EmailAuthProvider.credential(firebaseUser.value.email ?? '', values.password);
        await reauthenticateWithCredential(firebaseUser.value, emailCred);
        const body: UserUpdateBody = {
          username: values.username,
        };
        const newUser = await useRpgTogetherAPI.updateUser({ body });
        this.user = newUser;
        useSnackbarStore().createSnack({
          message: useNuxtApp().$i18n.t('user-store.success.change-username'),
          type: SnackType.SUCCESS,
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          message: useNuxtApp().$i18n.t('user-store.error.change-username'),
          type: SnackType.ERROR,
        });
        if (error instanceof FirebaseError) {
          return useNuxtApp().$i18n.t(`firebase-errors.${error.code}`) as string;
        }
        if (Object.values(ResponseMessages).includes((error as FetchError).data.message)) {
          return useNuxtApp().$i18n.t(`api-errors.${(error as FetchError).data.message}`) as string;
        }
      } finally {
        this.changingUsername = false;
      }
    },
    async changeAvatar(file: File) {
      try {
        if (this.changingAvatar) {
          return;
        }
        this.changingAvatar = true;
        const formData = new FormData();
        formData.append('file', file, `${DEFAULT_USER_AVATAR_NAME}.${file.name.split('.').pop()}`);
        const url = await useRpgTogetherAPI.uploadUserFile({ body: formData });
        const body: UserUpdateBody = {
          avatar: url,
        };
        const newUser = await useRpgTogetherAPI.updateUser({ body });
        this.user = newUser;
        useSnackbarStore().createSnack({
          message: useNuxtApp().$i18n.t('user-store.success.change-avatar'),
          type: SnackType.SUCCESS,
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          message: useNuxtApp().$i18n.t('user-store.error.change-avatar'),
          type: SnackType.ERROR,
        });
      } finally {
        this.changingAvatar = false;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
