import { TABLES_STORE } from '~~/constants';
import { useAlertsStore, useSnackbarStore } from '~/stores';
import { ResponseMessages, TableCreateBody, TableUpdateBody } from '@rpg-together/models';
import { DEFAULT_TABLE_BANNER } from '@rpg-together/utils';
import { SnackType } from '~~/custom-types';
import { FetchError } from 'ohmyfetch';

interface IState {
  // TODO: Change any for the table class.
  selectedTableCard: any;
  showTableCardOptionsModal: boolean;
  fetchingMyTables: boolean;
  creatingTable: boolean;
  updatingTable: boolean;
}

export const useTablesStore = defineStore(TABLES_STORE, {
  state: (): IState => ({
    selectedTableCard: null,
    showTableCardOptionsModal: false,
    fetchingMyTables: false,
    creatingTable: false,
    updatingTable: false,
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

    // TODO: Change any for the table class.
    toggleTableCardOptions(tableCard?: any) {
      if (tableCard) {
        this.selectedTableCard = tableCard;
        this.showTableCardOptionsModal = true;
        return;
      }
      this.selectedTableCard = null;
      this.showTableCardOptionsModal = false;
    },
    async fetchMyTables() {
      try {
        if (this.fetchingMyTables) {
          return;
        }
        this.fetchingMyTables = true;
        const userId = useFirebase.user().value?.uid ?? '';
        return await useRpgTogetherAPI.fetchMyTables({ userId });
      } catch (error) {
        useAlertsStore().handleError(error);
      } finally {
        this.fetchingMyTables = false;
      }
    },
    async createTable(values: TableCreateBody, bannerFile?: File) {
      try {
        if (this.creatingTable) {
          return;
        }
        this.creatingTable = true;
        const body: TableCreateBody = {
          ...values,
          banner: DEFAULT_TABLE_BANNER,
        };
        const newTable = await useRpgTogetherAPI.createTable({ body });
        if (bannerFile) {
          await this.updateTable(newTable.id, { ...values }, bannerFile);
        }
        useSnackbarStore().createSnack({
          message: useNuxtApp().$i18n.t('tables-store.success.create-table'),
          type: SnackType.SUCCESS,
        });
        navigateTo({ name: 'my-tables' });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          message: useNuxtApp().$i18n.t('tables-store.error.create-table'),
          type: SnackType.ERROR,
        });
        if (Object.values(ResponseMessages).includes((error as FetchError).data.message)) {
          return useNuxtApp().$i18n.t(`api-errors.${(error as FetchError).data.message}`) as string;
        }
      } finally {
        this.creatingTable = false;
      }
    },
    async updateTable(tabledId: string, values: TableUpdateBody, bannerFile?: File) {
      try {
        if (this.updatingTable) {
          return;
        }
        this.updatingTable = true;
        const body: TableUpdateBody = {
          ...values,
        };
        if (bannerFile) {
          const formData = new FormData();
          formData.append('file', bannerFile);
          const url = await useRpgTogetherAPI.uploadTableFile({ tableId: tabledId }, { body: formData });
          body.banner = url;
        }
        await useRpgTogetherAPI.updateTable({ tableId: tabledId }, { body });
        useSnackbarStore().createSnack({
          message: useNuxtApp().$i18n.t('tables-store.success.update-table'),
          type: SnackType.SUCCESS,
        });
      } catch (error) {
        useAlertsStore().handleError(error);
        useSnackbarStore().createSnack({
          message: useNuxtApp().$i18n.t('tables-store.error.update-table'),
          type: SnackType.ERROR,
        });
      } finally {
        this.updatingTable = false;
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTablesStore, import.meta.hot));
}
