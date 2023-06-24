import { signInWithEmailAndPassword, signOut, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { USER_STORE } from '~/constants';
import { SnackType } from '~/types';
import { useAlertsStore, useSnackbarStore } from '~/stores';
import { User, AuthUserRegisterBody, UserUpdateBody, AuthUserUpdateBody } from '@rpg-together/models';

interface IState {
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
      if (this.signingIn) {
        return;
      }
      const firebaseAuth = useFirebase.firebaseAuth().value;
      if (!firebaseAuth) {
        return;
      }
      try {
        this.signingIn = true;
        await signInWithEmailAndPassword(firebaseAuth, email, password);
      } catch (error) {
        useAlertsStore().handleError(error);
      } finally {
        this.signingIn = false;
      }
    },
    async signOut() {
      if (this.signingOut) {
        return;
      }
      const firebaseAuth = useFirebase.firebaseAuth().value;
      if (!firebaseAuth) {
        return;
      }
      try {
        this.signingOut = true;
        await signOut(firebaseAuth);
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
      try {
        this.registering = true;
        await useRpgTogetherAPI.register({ body });
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'user-store.success.register',
        });
        await this.signIn(body.email, body.password);
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'user-store.error.register',
        });
      } finally {
        this.registering = false;
      }
    },
    async changeAuthData(values: { password: string; newEmail?: string; newPassword?: string }) {
      if (this.changingAuthData) {
        return;
      }
      const firebaseUser = useFirebase.currentUser().value;
      if (!firebaseUser) {
        return;
      }
      try {
        this.changingAuthData = true;
        const emailCred = EmailAuthProvider.credential(firebaseUser.email ?? '', values.password);
        await reauthenticateWithCredential(firebaseUser, emailCred);
        const body: AuthUserUpdateBody = {
          password: values.newPassword,
          email: values.newEmail,
        };
        await useRpgTogetherAPI.updateAuthUser({ body });
        const newUser = await useRpgTogetherAPI.updateUser({
          body: { email: values.newEmail ?? firebaseUser.email ?? '' },
        });
        this.user = newUser;
        await this.signIn(values.newEmail ?? firebaseUser.email ?? '', values.newPassword ?? values.password);
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'user-store.success.change-auth-data',
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'user-store.error.change-auth-data',
        });
        return useAlertsStore().getErrorToShowUser(error);
      } finally {
        this.changingAuthData = false;
      }
    },
    async deleteAuth(password: string) {
      if (this.deletingAccount) {
        return;
      }
      const firebaseUser = useFirebase.currentUser().value;
      if (!firebaseUser) {
        return;
      }
      try {
        this.deletingAccount = true;
        const emailCred = EmailAuthProvider.credential(firebaseUser.email ?? '', password);
        await reauthenticateWithCredential(firebaseUser, emailCred);
        await useRpgTogetherAPI.deleteAuth();
        await this.signOut();
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'user-store.success.account-delete',
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'user-store.error.account-delete',
        });
        return useAlertsStore().getErrorToShowUser(error);
      } finally {
        this.deletingAccount = false;
      }
    },
    async getUser(userId: string, options?: { save?: boolean }) {
      try {
        const user = await useRpgTogetherAPI.getUser({ userId });
        if (options?.save) {
          this.user = user;
        }
        return user;
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'user-store.error.fetch-user',
        });
        return null;
      }
    },
    async changeUsername(values: { username: string; password: string }) {
      if (this.changingUsername) {
        return;
      }
      const firebaseUser = useFirebase.currentUser().value;
      if (!firebaseUser) {
        return;
      }
      try {
        this.changingUsername = true;
        const emailCred = EmailAuthProvider.credential(firebaseUser.email ?? '', values.password);
        await reauthenticateWithCredential(firebaseUser, emailCred);
        const body: UserUpdateBody = {
          username: values.username,
        };
        const newUser = await useRpgTogetherAPI.updateUser({ body });
        this.user = newUser;
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'user-store.success.change-username',
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'user-store.error.change-username',
        });
        return useAlertsStore().getErrorToShowUser(error);
      } finally {
        this.changingUsername = false;
      }
    },
    async changeAvatar(file: File) {
      if (this.changingAvatar) {
        return;
      }
      try {
        this.changingAvatar = true;
        const formData = new FormData();
        formData.append('file', file);
        const url = await useRpgTogetherAPI.uploadUserFile({ body: formData });
        const body: UserUpdateBody = {
          avatar: url,
        };
        const newUser = await useRpgTogetherAPI.updateUser({ body });
        this.user = newUser;
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'user-store.success.change-avatar',
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'user-store.error.change-avatar',
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
