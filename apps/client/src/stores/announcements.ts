import { ANNOUNCEMENTS_STORE } from '~/constants'

interface IState {}

export const useAnnouncementsStore = defineStore(ANNOUNCEMENTS_STORE, {
  state: (): IState => ({}),
  getters: {},
  actions: {
    getAnnouncements(_limit?: number) {
      return [
        {
          id: '1',
          date: new Date(),
          title: 'First announcement',
          message:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tellus arcu, pretium ut lorem in, tempor laoreet neque.Proin biam.',
        },
        {
          id: '2',
          date: new Date(),
          title: 'Second announcement',
          message:
            'Nam interdum, arcu eget luctus ornare, metus lacus porttitor sem, eget mollis turpis turpis ac massa. Pellentesque dolor mauris.',
        },
        {
          id: '3',
          date: new Date(),
          title: 'Third announcement',
          message:
            'Integer metus lorem, commodo sed pharetra id, cursus id enim. Cras lobortis neque eu ullamcorper elementum. Fusce eu elit ut ut.',
        },
      ]
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAnnouncementsStore, import.meta.hot))
