import { Notification } from '@rpg-together/models';
import { NOTIFICATIONS_STORE } from '~/constants';
import { useAlertsStore } from '~/stores';

interface IState {
  notifications: Notification[];
  firstSearch: boolean;
}

export const useNotificationsStore = defineStore(NOTIFICATIONS_STORE, {
  state: (): IState => ({ notifications: [], firstSearch: false }),
  getters: {
    unreadNotifications(state) {
      return state.notifications.filter((notification) => !notification.read).length;
    },
  },
  actions: {
    async getMyNotifications(options?: { save: boolean }) {
      const firebaseUser = useFirebase.currentUser().value;
      if (!firebaseUser) {
        return;
      }
      try {
        const applications = await useRpgTogetherAPI.getNotificationsFromUser({ userId: firebaseUser.uid });
        if (options?.save) {
          this.notifications = applications;
        }
        return applications;
      } catch (error) {
        useAlertsStore().handleError(error);
      } finally {
        console.log('nice');
        if (!this.firstSearch) {
          this.firstSearch = true;
        }
      }
    },
    async readNotification(notificationId: string) {
      try {
        const existingIndex = this.notifications.findIndex((notification) => notification.id === notificationId);
        if (existingIndex < 0) {
          return;
        }
        this.notifications[existingIndex].read = true;
        await useRpgTogetherAPI.readNotification({ notificationId });
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
    async readAllNotifications() {
      try {
        await Promise.all(this.notifications.map((notification) => this.readNotification(notification.id)));
      } catch (error) {
        useAlertsStore().handleError(error);
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot));
}
