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
}, 500)

useInfiniteScroll(pageRef, () => {
  if (noMoreTables.value || !firstSearchMade.value)
    return
  searchDebounceFn(true)
}, { distance: 32, interval: 1000 })
const { y: pageY } = useScroll(pageRef, { behavior: 'smooth' })
const scrollToTop = () => (pageY.value = 0)
const showScrollToTopButton = computed(() => currentSearchPage.value >= 0 && pageY.value !== 0)

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
  <div ref="pageRef" class="flex flex-col gap-3 h-full overflow-y-auto lg:gap-5">
    <PageTitle :title="$t('search.title')" />
    <div class="flex flex-col gap-3 w-full px-3 lg:px-0 lg:gap-5 lg:max-w-5xl lg:mx-auto">
      <div class="flex flex-col gap-2">
        <div class="relative flex items-center py-2 border border-primary-light rounded lg:py-3">
          <NuxtIcon name="search-tool" class="absolute px-3 text-lg pointer-events-none lg:px-4 lg:text-xl" />
          <input
            v-model="query"
            type="text"
            :placeholder="$t('search.search')"
            class="w-full h-full px-[42px] outline-none bg-transparent lg:px-[52px] text-sm lg:text-base"
          >
          <button
            class="absolute right-0 flex px-3 opacity-50 transition-transform active:rotate-90 lg:px-4 lg:text-lg"
            @click.prevent="query = ''"
          >
            <NuxtIcon name="x-close" />
          </button>
        </div>
        <FlairsMenu v-model="flairs" />
      </div>
      <i18n-t v-if="result?.nbHits" keypath="search.results-for" tag="h1" scope="global" class="text-sm text-center">
        <template #amount>
          <span class="font-semibold">{{ result?.nbHits }}</span>
        </template>
      </i18n-t>
      <div class="flex flex-col">
        <div v-if="tables?.length" class="flex flex-col">
          <div class="flex flex-col gap-3 lg:gap-5 lg:grid lg:grid-cols-2">
            <TablesCard v-for="table in tables" :key="table.id" :table="table" />
          </div>
          <p v-if="noMoreTables" class="py-8 lg:py-16 text-sm text-center">
            {{ $t('search.no-more-tables') }}
          </p>
          <button v-else class="btn-accent" @click.prevent="searchDebounceFn(true)">
            {{ $t('search.load-more') }}
          </button>
        </div>
        <LoadingCard v-else-if="!firstSearchMade" />
        <p v-else class="py-8 lg:py-16 text-sm text-center text-secondary-dark">
          {{ $t('search.no-tables-found') }}
        </p>
      </div>
    </div>
    <Transition name="slide-left">
      <button
        v-if="showScrollToTopButton"
        class="btn-accent fixed right-3 bottom-[72px] h-12 rounded-full aspect-square lg:right-[72px] lg:h-14"
        @click.prevent="scrollToTop"
      >
        <NuxtIcon name="chevron-up" class="text-xl" />
      </button>
    </Transition>
  </div>
</template>
