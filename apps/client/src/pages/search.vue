<script setup lang="ts">
import { Table } from '@rpg-together/models'
import { useInfiniteScroll } from '@vueuse/core'
import { useSearchStore } from '~/stores'

useHead({ title: useNuxtApp().$i18n.t('search.title') })

const { result, search } = useAlgoliaSearch('dev_tables')
const searchStore = useSearchStore()
const { cachedSearch, checkIfSearchCached } = storeToRefs(searchStore)

const pageRef = ref<HTMLElement | null>(null)
const query = ref('')
const flairs = ref<string[]>([])
const tables = ref<Table[]>([])
const firstSearchMade = ref(false)
const searching = ref(false)
const noMoreTables = ref(false)
const hitsPerPage = ref(5)
const currentSearchPage = ref(0)

const searchDebounceFn = useDebounceFn(async (continuous?: true) => {
  if (searching.value)
    return

  searching.value = true
  const facetFilters = flairs.value.length ? flairs.value.map(flair => `flairs:${flair}`) : []

  continuous ? currentSearchPage.value++ : currentSearchPage.value = 0

  await search({
    query: query.value,
    requestOptions: { facetFilters, hitsPerPage: hitsPerPage.value, page: currentSearchPage.value },
  })
  const newTables = result.value?.hits.length ? result.value?.hits.map((hit: Record<string, unknown>) => Table.fromMap(hit)) : []
  if (!newTables.length || newTables.length < hitsPerPage.value)
    noMoreTables.value = true

  continuous ? tables.value?.push(...newTables) : tables.value = newTables

  searchStore.setSearchCache({
    tables: toRaw(tables.value),
    query: query.value,
    flairs: toRaw(flairs.value),
    currentSearchPage: currentSearchPage.value,
    noMoreTables: noMoreTables.value,
  })
  searching.value = false
}, 1000)

useInfiniteScroll(pageRef, () => {
  if (noMoreTables.value || !firstSearchMade.value)
    return
  searchDebounceFn(true)
}, { distance: 32, interval: 1000 })
const { y: pageY } = useScroll(pageRef, { behavior: 'smooth' })
const scrollToTop = () => (pageY.value = 0)
const showScrollToTopButton = computed(() => currentSearchPage.value >= 1 && pageY.value !== 0)

watch([query, flairs], () => {
  if (!firstSearchMade.value)
    return
  searchDebounceFn()
})

onMounted(async () => {
  if (checkIfSearchCached.value) {
    const { tables: cTables, query: cQuery, flairs: cFlairs, currentSearchPage: cCurrentSearchPage, noMoreTables: cNoMoreTables } = cachedSearch.value
    tables.value = cTables
    query.value = cQuery
    flairs.value = cFlairs
    currentSearchPage.value = cCurrentSearchPage
    noMoreTables.value = cNoMoreTables
    firstSearchMade.value = true
    return
  }
  await searchDebounceFn()
  firstSearchMade.value = true
})
</script>

<template>
  <div ref="pageRef" class="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('search.title')" />
    <div class="flex flex-col gap-2 px-2">
      <div class="relative flex items-center border border-primary-light rounded">
        <NuxtIcon name="search-tool" class="absolute left-3 text-lg pointer-events-none" />
        <input
          v-model="query"
          type="text"
          :placeholder="$t('search.search')"
          class="w-full h-full px-[42px] py-2 outline-none bg-transparent"
        >
        <button
          class="absolute right-0 flex px-3 py-2 opacity-50 transition-transform active:rotate-90"
          @click.prevent="query = ''"
        >
          <NuxtIcon name="x-close" />
        </button>
      </div>
      <FlairsMenu @change="(value) => (flairs = value)" />
    </div>
    <i18n-t v-if="result?.nbHits" keypath="search.results-for" tag="h1" scope="global" class="px-2 text-sm text-center">
      <template #amount>
        <span class="font-semibold">{{ result?.nbHits }}</span>
      </template>
    </i18n-t>
    <div class="flex flex-col p-2">
      <div v-if="tables?.length" class="flex flex-col gap-4">
        <TablesCard v-for="table in tables" :key="table.id" :table="table" />
        <p v-if="noMoreTables" class="p-2 text-sm text-center">
          {{ $t('search.no-more-tables') }}
        </p>
        <button v-else class="btn-accent" @click.prevent="searchDebounceFn(true)">
          {{ $t('search.load-more') }}
        </button>
      </div>
      <LoadingCard v-else-if="!firstSearchMade" />
      <p v-else class="p-2 text-sm text-center text-secondary-dark">
        {{ $t('search.no-tables-found') }}
      </p>
    </div>
    <Transition name="slide-left">
      <button
        v-if="showScrollToTopButton"
        class="btn-accent fixed right-2 bottom-[72px] h-[46px] rounded-full"
        @click.prevent="scrollToTop"
      >
        <NuxtIcon name="chevron-up" class="text-xl" />
      </button>
    </Transition>
  </div>
</template>
