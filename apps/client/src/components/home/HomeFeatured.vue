<script setup lang="ts">
import { Table } from '@rpg-together/models'
import { useSearchStore } from '~/stores'

const { result, search } = useAlgoliaSearch('dev_tables')
const searchStore = useSearchStore()
const { cachedFeaturedTables } = storeToRefs(searchStore)

const tables = ref<Table[]>()
const madeFirstSearch = ref(false)

async function newSearch() {
  await search({ query: '', requestOptions: { facetFilters: [], hitsPerPage: 10, page: 0 } })
  tables.value = result.value?.hits.map((hit: Record<string, unknown>) => Table.fromMap(hit))
  searchStore.setFeaturedTables(toRaw(tables.value))
}

onMounted(async () => {
  if (cachedFeaturedTables.value.length) {
    tables.value = cachedFeaturedTables.value
    madeFirstSearch.value = true
    return
  }
  await newSearch()
  madeFirstSearch.value = true
})
</script>

<template>
  <div class="flex flex-col gap-3 w-full px-3 lg:px-0 lg:gap-5 lg:max-w-5xl lg:mx-auto">
    <div class="flex items-center gap-3 font-semibold text-lg lg:text-xl">
      <NuxtIcon name="bookmark-star" />
      <h1>{{ $t('components.home.featured.title') }}</h1>
    </div>
    <div v-if="tables?.length" class="flex gap-3 pb-3 overflow-x-auto snap-x snap-mandatory">
      <TablesCard v-for="table in tables" :key="table.id" :table="table" class="snap-center min-w-[90%] md:min-w-[60%] lg:min-w-[40%] h-fit" />
    </div>
    <LoadingCard v-else-if="!madeFirstSearch" />
    <p v-else class="p-2 text-sm text-center text-secondary-2">
      {{ $t('components.home.featured.no-tables-found') }}
    </p>
  </div>
</template>
