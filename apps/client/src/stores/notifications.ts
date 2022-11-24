import { NOTIFICATIONS_STORE } from '~~/constants';

interface IState {
  unreadNotificationsNumber: number;
}

export const useNotificationsStore = defineStore(NOTIFICATIONS_STORE, {
  state: (): IState => ({ unreadNotificationsNumber: 0 }),
  getters: {},
  actions: {
    getNotifications() {
      return [
        {
          id: '1',
          type: 'application',
          read: false,
          title: 'Alert number 1',
          message: 'Cras eleifend bibendum libero, eu imperdiet libero consequat ut. Nullam.',
        },
        {
          id: '2',
          type: 'system',
          read: true,
          title: 'Alert number 2',
          message: 'Vivamus nec est elit. Nullam rhoncus porttitor congue. Pellentesque auctor.',
        },
        {
          id: '3',
          type: 'report',
          read: true,
          title: 'Alert number 3',
          message: 'Praesent convallis interdum tellus at auctor. Proin elit velit, volutpat.',
        },
      ];
    },
    async updateUnreadNotificationsNumber() {
      try {
        this.unreadNotificationsNumber = Math.round(Math.random() * 10);
      } catch (error) {}
    },
    async markAsRead(id: string) {
      try {
        this.updateUnreadNotificationsNumber();
        return true;
      } catch (error) {
        return false;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot));
}
