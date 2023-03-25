<script setup lang="ts">
import { useTablesStore } from '~/stores';
import { Table } from '@rpg-together/models';

const tablesStore = useTablesStore();

const { result, search } = useAlgoliaSearch('dev_tables');

const tables = ref<Table[]>();

const newSearch = async () => {
  await search({ query: '', requestOptions: { facetFilters: [], hitsPerPage: 10, page: 0 } });
  tables.value = result.value?.hits.length ? result.value?.hits.map((hit: unknown) => Table.fromMap(hit)) : [];
};

onMounted(() => {
  newSearch();
});
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <div class="flex items-center gap-2 font-semibol">
      <NuxtIcon name="bookmark-star" />
      <h1>{{ $t('home-featured.title') }}</h1>
    </div>
    <div v-if="tables?.length" class="flex gap-3 overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar">
      <TableCard v-for="table in tables" :key="table.id" :table="table" class="snap-center min-w-[90%]" />
    </div>
    <LoadingCard v-else />
  </div>
</template>
