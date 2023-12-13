<script setup lang="ts">
import { Table } from '@rpg-together/models'
import { useInfiniteScroll } from '@vueuse/core'
import { useSearchStore } from '~/stores'

definePageMeta({ layout: 'inner-scroll' })

useHead({ title: useNuxtApp().$i18n.t('pages.search.title') })

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
  <div ref="pageRef" class="flex flex-col gap-5 lg:pt-9 lg:gap-9 overflow-y-auto">
    <PageTitle :title="$t('pages.search.title')" />
    <div class="flex flex-col gap-3 w-full px-3 lg:px-0 lg:gap-5 lg:max-w-5xl lg:mx-auto">
      <div class="flex flex-col gap-3">
        <div class="relative flex items-center gap-2 px-3 py-2 border border-primary-2 rounded lg:py-3">
          <button class="text-lg lg:text-xl" :disabled="!query.length" @click.prevent="query = ''">
            <NuxtIcon :name="query ? 'x-close' : 'search-tool'" />
          </button>
          <input
            v-model="query"
            type="text"
            :placeholder="$t('pages.search.search')"
            class="flex-1 flex h-full outline-none bg-transparent text-sm lg:text-base"
          >
        </div>
        <FlairsMenu v-model="flairs" />
      </div>
      <i18n-t v-if="result?.nbHits" keypath="pages.search.results-for" tag="h1" scope="global" class="text-sm lg:text-base text-center">
        <template #amount>
          <span class="font-semibold">{{ result?.nbHits }}</span>
        </template>
      </i18n-t>
      <div class="flex flex-col">
        <div v-if="tables?.length" class="flex flex-col gap-3 lg:gap-5">
          <div class="flex flex-col gap-3 lg:gap-5 lg:grid lg:grid-cols-2">
            <TablesCard v-for="table in tables" :key="table.id" :table="table" />
          </div>
          <p v-if="noMoreTables" class="p-5 lg:p-9 bg-primary-1 rounded-sm text-sm lg:text-base text-center text-secondary-2">
            {{ $t('pages.search.no-more-tables') }}
          </p>
          <button v-else class="btn btn-accent" @click.prevent="searchDebounceFn(true)">
            {{ $t('pages.search.load-more') }}
          </button>
        </div>
        <LoadingCard v-else-if="!firstSearchMade" />
        <p v-else class="p-5 lg:p-9 bg-primary-1 rounded-sm text-sm lg:text-base text-center text-secondary-2">
          {{ $t('pages.search.no-tables-found') }}
        </p>
      </div>
      <Footer />
    </div>
    <Transition name="slide-left">
      <button
        v-if="showScrollToTopButton"
        class="btn btn-accent fixed right-3 bottom-[70px] w-auto aspect-square rounded-full lg:right-[70px] lg:scale-150"
        @click.prevent="scrollToTop"
      >
        <NuxtIcon name="chevron-up" />
      </button>
    </Transition>
  </div>
</template>
