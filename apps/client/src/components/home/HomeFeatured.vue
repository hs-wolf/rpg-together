<script setup lang="ts">
import { useTablesStore } from '~/stores';

const tablesStore = useTablesStore();

// TODO: Change any for the table class.
const tables = ref<any[]>();
onMounted(() => {
  tables.value = tablesStore.getFeaturedTables();
});
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <div class="flex items-center gap-2 font-semibol">
      <Icon name="bi:bookmark-star-fill" />
      <h1>{{ $t('home-featured.title') }}</h1>
    </div>
    <div v-if="tables?.length" class="flex gap-3 overflow-x-auto overflow-y-hidden snap-x snap-mandatory hide-scrollbar">
      <TableCard v-for="table in tables" :key="table.id" :table="table" class="snap-center min-w-[90%]" />
    </div>
    <LoadingCard v-else />
  </div>
</template>
