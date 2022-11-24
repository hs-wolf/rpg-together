import { TABLES_STORE } from '~~/constants';

interface IState {
  // TODO: Change any for the table class.
  selectedTableCard: any;
  showTableCardOptionsModal: boolean;
}

export const useTablesStore = defineStore(TABLES_STORE, {
  state: (): IState => ({
    selectedTableCard: null,
    showTableCardOptionsModal: false,
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
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTablesStore, import.meta.hot));
}
