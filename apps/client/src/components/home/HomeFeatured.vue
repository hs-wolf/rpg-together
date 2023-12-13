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
  // await newSearch()
  tables.value = [
    Table.fromMap({
      id: '65751b322383a4325297fb78',
      owner: { id: '654b3f7cc0dec74d8d0069cd', username: 'hswolf', avatar: 'https://placehold.co/512x512?text=Avatar' },
      title: 'asdcdsdf',
      description: 'rgrgrg',
      banner: 'https://firebasestorage.googleapis.com/v0/b/rpg-together-44d2e.appspot.com/o/tables%2F65751b322383a4325297fb78%2Fbanner.jpg?alt=media&token=f6ce02b8-2907-403b-a11b-c55ee5217589',
      flairs: ['64e76a93c4c83af4553a31b2'],
      acceptMessageId: '65751b312383a4325297fb77',
      creationDate: '[native Date Sat Dec 09 2023 22:58:09 GMT-0300 (Brasilia Standard Time)]',
      lastUpdateDate: '[native Date Sat Dec 09 2023 22:58:15 GMT-0300 (Brasilia Standard Time)]',
    }),
    Table.fromMap({
      id: '65751b322383a4325297fb78',
      owner: { id: '654b3f7cc0dec74d8d0069cd', username: 'hswolf', avatar: 'https://placehold.co/512x512?text=Avatar' },
      title: 'Pandoras Gate',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sollicitudin euismod turpis, sit amet ornare odio malesuada non. Nulla non malesuada felis. Maecenas egestas sapien nec nulla convallis finibus. Aliquam tortor ex, suscipit id maximus ut sit. ',
      banner: 'https://firebasestorage.googleapis.com/v0/b/rpg-together-44d2e.appspot.com/o/tables%2F65751b322383a4325297fb78%2Fbanner.jpg?alt=media&token=f6ce02b8-2907-403b-a11b-c55ee5217589',
      flairs: ['64e76a93c4c83af4553a31b2', '64e76a62c4c83af4553a31b1', '64e76b18c4c83af4553a31b5', '64e76b55c4c83af4553a31b8'],
      acceptMessageId: '65751b312383a4325297fb77',
      creationDate: '[native Date Sat Dec 09 2023 22:58:09 GMT-0300 (Brasilia Standard Time)]',
      lastUpdateDate: '[native Date Sat Dec 09 2023 22:58:15 GMT-0300 (Brasilia Standard Time)]',
    }),
    Table.fromMap({
      id: '65751b322383a4325297fb78',
      owner: { id: '654b3f7cc0dec74d8d0069cd', username: 'hswolf', avatar: 'https://placehold.co/512x512?text=Avatar' },
      title: 'asdcdsdf',
      description: 'rgrgrg',
      banner: 'https://firebasestorage.googleapis.com/v0/b/rpg-together-44d2e.appspot.com/o/tables%2F65751b322383a4325297fb78%2Fbanner.jpg?alt=media&token=f6ce02b8-2907-403b-a11b-c55ee5217589',
      flairs: ['64e76a93c4c83af4553a31b2'],
      acceptMessageId: '65751b312383a4325297fb77',
      creationDate: '[native Date Sat Dec 09 2023 22:58:09 GMT-0300 (Brasilia Standard Time)]',
      lastUpdateDate: '[native Date Sat Dec 09 2023 22:58:15 GMT-0300 (Brasilia Standard Time)]',
    }),
  ]
  madeFirstSearch.value = true
})
</script>

<template>
  <div class="flex flex-col gap-3 w-full px-3 lg:px-0 lg:gap-5 lg:max-w-5xl lg:mx-auto">
    <div class="flex items-center gap-1.5">
      <NuxtIcon name="bookmark-star" class="text-xl lg:text-2xl" />
      <h1 class="text-lg lg:text-xl font-semibold">
        {{ $t('components.home.featured.title') }}
      </h1>
    </div>
    <div v-if="tables?.length" class="flex gap-3 pb-2 lg:pb-4 overflow-x-auto snap-x snap-mandatory">
      <TablesCard v-for="table in tables" :key="table.id" :table="table" class="snap-center min-w-[90%] max-w-[90%] md:min-w-[60%] md:max-w-[60%] lg:min-w-[40%] lg:max-w-[40%] h-fit" />
    </div>
    <LoadingCard v-else-if="!madeFirstSearch" />
    <p v-else class="p-5 lg:p-9 bg-primary-1 rounded-sm text-sm lg:text-base text-center text-secondary-2">
      {{ $t('components.home.featured.no-tables-found') }}
    </p>
  </div>
</template>
