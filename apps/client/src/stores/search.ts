import type { Table } from '@rpg-together/models'
import { SEARCH_STORE } from '~/constants'
import type { SearchCache } from '~/types'

interface IState {
  cachedFeaturedTables: Table[]
  cachedSearch: SearchCache
}

export const useSearchStore = defineStore(SEARCH_STORE, {
  state: (): IState => ({
    cachedFeaturedTables: [],
    cachedSearch: {
      tables: [],
      query: '',
      flairs: [],
      currentSearchPage: 0,
      noMoreTables: false,
    },
  }),
  getters: {
    checkIfSearchCached(): boolean {
      return !!(this.cachedSearch.tables.length || this.cachedSearch.noMoreTables)
    },
  },
  actions: {
    setFeaturedTables(tables?: Table[]) {
      this.cachedFeaturedTables = tables ?? []
    },
    setSearchCache(cache: SearchCache) {
      this.cachedSearch = cache
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSearchStore, import.meta.hot))
