import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { APPLICATIONS_STORE } from '~/constants';
import { SnackType } from '~/types';
import { useAlertsStore, useSnackbarStore } from '~/stores';
import { Application, ApplicationCreateBody } from '@rpg-together/models';
import { DEFAULT_TABLE_BANNER } from '@rpg-together/utils';

interface IState {
  myApplications: Application[];
  sendingApplication: boolean;
}

export const useApplicationsStore = defineStore(APPLICATIONS_STORE, {
  state: (): IState => ({
    myApplications: [],
    sendingApplication: false,
  }),
  getters: {},
  actions: {
    async fetchMyApplications(options?: { save: boolean }) {
      const firebaseUser = useFirebase.currentUser().value;
      if (!firebaseUser) {
        return;
      }
      try {
        const applications = await useRpgTogetherAPI.getApplicationsFromUser({ userId: firebaseUser.uid });
        if (options?.save) {
          this.myApplications = applications;
        }
        return applications;
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
    async getApplicationsFromUser(userId: string) {
      try {
        return await useRpgTogetherAPI.getApplicationsFromUser({ userId });
      } catch (error) {
        useAlertsStore().handleError(error);
        return [];
      }
    },
    async getApplicationsFromTable(tableId: string) {
      try {
        return await useRpgTogetherAPI.getApplicationsFromTable({ tableId });
      } catch (error) {
        useAlertsStore().handleError(error);
        return [];
      }
    },
    async fetchApplication(applicationId: string) {
      try {
        return await useRpgTogetherAPI.getApplication({ applicationId });
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
    async sendApplication(values: ApplicationCreateBody) {
      try {
        if (this.sendingApplication) {
          return;
        }
        this.sendingApplication = true;
        await useRpgTogetherAPI.createApplication({ body: values });
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'applications-store.success.create-application',
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'applications-store.error.create-application',
        });
        return useAlertsStore().getErrorToShowUser(error);
      } finally {
        this.sendingApplication = false;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useApplicationsStore, import.meta.hot));
}
