import { FirebaseError } from 'firebase/app';
import { ALERTS_STORE } from '~/constants';
import { ResponseMessages, Table, TableCreateBody, TableUpdateBody } from '@rpg-together/models';

interface IState {}

export const useAlertsStore = defineStore(ALERTS_STORE, {
  state: (): IState => ({}),
  getters: {},
  actions: {
    handleError(error: unknown) {
      console.error('🛑 ERROR:', error);
    },
    handleWarning(error: unknown) {
      console.log('⚠️ WARNING:', error);
    },
    getErrorToShowUser(error: unknown) {
      const { t } = useNuxtApp().$i18n;
      if (error instanceof FirebaseError) {
        return t(`firebase-errors.${error.code}`) as string;
      }
      if (Object.values(ResponseMessages).includes((error as any).data.message)) {
        return t(`api-errors.${(error as any).data.message}`) as string;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAlertsStore, import.meta.hot));
}
