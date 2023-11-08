<script setup lang="ts">
import { Table } from '@rpg-together/models'
import { useSearchStore } from '~/stores'

const { result, search } = useAlgoliaSearch('dev_tables')
const searchStore = useSearchStore()
const { cachedFeaturedTables } = storeToRefs(searchStore)

const tables = ref<Table[]>()

async function newSearch() {
  await search({ query: '', requestOptions: { facetFilters: [], hitsPerPage: 10, page: 0 } })
  tables.value = result.value?.hits.map((hit: Record<string, unknown>) => Table.fromMap(hit))
  searchStore.setFeaturedTables(toRaw(tables.value))
}

onMounted(() => {
  if (cachedFeaturedTables.value.length) {
    tables.value = cachedFeaturedTables.value
    return
  }
  newSearch()
})
</script>

<template>
  <div class="flex flex-col gap-4 p-2">
    <div class="flex items-center gap-2 font-semibold">
      <NuxtIcon name="bookmark-star" />
      <h1>{{ $t('home-featured.title') }}</h1>
    </div>
    <div v-if="tables?.length" class="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar">
      <TablesCard v-for="table in tables" :key="table.id" :table="table" class="snap-center min-w-[90%] md:min-w-[60%] lg:min-w-[30%] h-fit" />
    </div>
    <LoadingCard v-else />
  </div>
</template>
