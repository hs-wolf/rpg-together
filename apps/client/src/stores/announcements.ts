import { ANNOUNCEMENTS_STORE } from '~/constants'
import { useAlertsStore } from '~/stores'

interface IState {}

export const useAnnouncementsStore = defineStore(ANNOUNCEMENTS_STORE, {
  state: (): IState => ({}),
  getters: {},
  actions: {
    async getAnnouncements(_limit?: number) {
      try {
        const announcements = await useRpgTogetherAPI.getAnnouncements()
        return _limit ? announcements.slice(0, _limit) : announcements
      }
      catch (error) {
        useAlertsStore().handleError(error)
        return []
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAnnouncementsStore, import.meta.hot))
