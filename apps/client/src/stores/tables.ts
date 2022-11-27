import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { TABLES_STORE } from '~/constants';
import { SnackType } from '~/types';
import { useAlertsStore, useSnackbarStore } from '~/stores';
import { Table, TableCreateBody, TableUpdateBody } from '@rpg-together/models';
import { DEFAULT_TABLE_BANNER } from '@rpg-together/utils';

interface IState {
  selectedTableCard: any;
  showTableCardOptionsModal: boolean;
  myTables: Table[];
  fetchingMyTables: boolean;
  creatingTable: boolean;
  updatingTable: boolean;
  deletingTable: boolean;
}

export const useTablesStore = defineStore(TABLES_STORE, {
  state: (): IState => ({
    selectedTableCard: null,
    showTableCardOptionsModal: false,
    myTables: [],
    fetchingMyTables: false,
    creatingTable: false,
    updatingTable: false,
    deletingTable: false,
  }),
  getters: {},
  actions: {
    getFeaturedTables() {
      return [
        {
          id: '1',
          title: 'Abyss Temple',
          flairs: ['D&D', 'Adult content', 'English', '8 Slots', 'Dark Fantasy'],
          owner: {
            avatar: 'https://i.pinimg.com/280x280_RS/6b/c7/31/6bc731fbe8866f02d929c5579ccd4f45.jpg',
            name: 'Username 1',
          },
          summary:
            'Sed blandit ornare tellus, non iaculis risus aliquet at. Suspendisse lectus nibh, porta non lacinia sit amet, molestie quis magna. Nullam rhoncus, nulla non gravida pellentesque, nisl orci tempor erat, lacinia imperdiet turpis sem non orci. Donec vel orci.',
          banner: 'https://www.pcgamesn.com/wp-content/uploads/2022/01/fantasy-games-elden-ring.jpg',
        },
        {
          id: '2',
          title: 'Cursed Pirates',
          flairs: ['7th Sea', 'Adult content', 'English', '3 Slots', 'Sword and Cape'],
          owner: {
            avatar: 'https://i.pinimg.com/280x280_RS/6b/c7/31/6bc731fbe8866f02d929c5579ccd4f45.jpg',
            name: 'Username 2',
          },
          summary:
            'Aenean ornare vehicula lectus, accumsan varius eros blandit ut. Sed molestie, sapien id facilisis tincidunt, sapien purus tristique tortor, at feugiat enim est et ipsum. Aenean nec finibus enim, quis sodales mi. Curabitur fermentum magna nec nunc pharetra.',
          banner:
            'https://cdn.vox-cdn.com/thumbor/fccqXsZbPuH7DnlI4Qn7XybX34k=/0x0:2048x1152/1200x800/filters:focal(861x413:1187x739)/cdn.vox-cdn.com/uploads/chorus_image/image/70878822/2048_1152_nocopy.0.jpg',
        },
        {
          id: '3',
          title: 'Knights of the Round Table',
          flairs: ['7th Sea', 'Adult content', 'English', '3 Slots', 'Sword and Cape'],
          owner: {
            avatar: 'https://i.pinimg.com/280x280_RS/6b/c7/31/6bc731fbe8866f02d929c5579ccd4f45.jpg',
            name: 'Username 3',
          },
          summary:
            'Morbi blandit vestibulum pretium. Pellentesque feugiat leo in felis fermentum bibendum. Nullam massa orci, consequat et quam ut, posuere sodales ex. Quisque in tortor interdum, pharetra erat sed, congue ligula. Ut vitae massa vitae dui maximus luctus quam.',
          banner: 'https://i.ytimg.com/vi/q_weaD47HmY/maxresdefault.jpg',
        },
      ];
    },
    toggleTableCardOptions(tableCard?: any) {
      if (tableCard) {
        this.selectedTableCard = tableCard;
        this.showTableCardOptionsModal = true;
        return;
      }
      this.selectedTableCard = null;
      this.showTableCardOptionsModal = false;
    },
    async fetchMyTables(options?: { save: boolean }) {
      if (this.fetchingMyTables) {
        return;
      }
      const firebaseUser = useFirebase.user().value;
      if (!firebaseUser) {
        return;
      }
      try {
        this.fetchingMyTables = true;
        const tables = await useRpgTogetherAPI.fetchMyTables({ userId: firebaseUser.uid });
        if (options?.save) {
          this.myTables = tables;
        }
        return tables;
      } catch (error) {
        useAlertsStore().handleError(error);
      } finally {
        this.fetchingMyTables = false;
      }
    },
    async createTable(values: TableCreateBody, bannerFile?: File) {
      if (this.creatingTable) {
        return;
      }
      try {
        this.creatingTable = true;
        const body: TableCreateBody = {
          ...values,
          banner: DEFAULT_TABLE_BANNER,
        };
        const table = await useRpgTogetherAPI.createTable({ body });
        this.myTables.push(table);
        if (bannerFile) {
          await this.updateTable(table.id, { ...values }, bannerFile);
        }
        navigateTo({ name: 'my-tables' });
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'tables-store.success.create-table',
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'tables-store.error.create-table',
        });
        return useAlertsStore().getErrorToShowUser(error);
      } finally {
        this.creatingTable = false;
      }
    },
    async updateTable(tableId: string, values: TableUpdateBody, bannerFile?: File) {
      if (this.updatingTable) {
        return;
      }
      try {
        this.updatingTable = true;
        const body: TableUpdateBody = {
          ...values,
        };
        if (bannerFile) {
          const formData = new FormData();
          formData.append('file', bannerFile);
          const url = await useRpgTogetherAPI.uploadTableFile({ tableId }, { body: formData });
          body.banner = url;
        }
        const table = await useRpgTogetherAPI.updateTable({ tableId }, { body });
        const tableIndex = this.myTables.findIndex((table) => table.id === tableId);
        if (tableIndex >= 0) {
          this.myTables[tableIndex] = table;
        }
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'tables-store.success.update-table',
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'tables-store.error.update-table',
        });
        return useAlertsStore().getErrorToShowUser(error);
      } finally {
        this.updatingTable = false;
      }
    },
    async deleteTable(tableId: string, password: string) {
      if (this.deletingTable) {
        return;
      }
      const firebaseUser = useFirebase.user().value;
      if (!firebaseUser) {
        return;
      }
      try {
        this.deletingTable = true;
        const emailCred = EmailAuthProvider.credential(firebaseUser.email ?? '', password);
        await reauthenticateWithCredential(firebaseUser, emailCred);
        await useRpgTogetherAPI.deleteTable({ tableId });
        const tableIndex = this.myTables.findIndex((table) => table.id === tableId);
        if (tableIndex >= 0) {
          this.myTables.splice(tableIndex, 1);
        }
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'tables-store.success.delete-table',
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'tables-store.error.delete-table',
        });
        return useAlertsStore().getErrorToShowUser(error);
      } finally {
        this.deletingTable = false;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTablesStore, import.meta.hot));
}
