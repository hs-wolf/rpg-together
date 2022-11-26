<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AdvancedSelectOption } from '~~/custom-types';
import { useTablesStore } from '~/stores';

useHead({ title: useI18n().t('search.title') });

const tablesStore = useTablesStore();
const query = ref('');

const tables = ref<any[]>([]);
onMounted(() => {
  tables.value = tablesStore.getFeaturedTables();
});
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="$t('search.title')" />
    <div class="flex flex-col gap-3 p-3">
      <div class="relative flex items-center border border-primary-light rounded">
        <Icon name="material-symbols:search-rounded" class="absolute left-3 text-lg pointer-events-none" />
        <input
          type="text"
          v-model="query"
          placeholder="Search"
          class="w-full h-full px-[42px] py-2 outline-none bg-transparent"
        />
        <button
          class="absolute right-0 flex px-3 py-2 opacity-50 transition-transform active:rotate-90"
          @click.prevent="query = ''"
        >
          <Icon name="material-symbols:close" />
        </button>
      </div>
      <FlairsMenu />
    </div>
    <i18n-t v-if="query" keypath="search.results-for" tag="h1" class="p-3 text-sm text-center">
      <template v-slot:amount>
        <span class="font-semibold">{{ tables?.length }}</span>
      </template>
      <template v-slot:query>
        <span class="font-semibold">{{ query }}</span>
      </template>
    </i18n-t>
    <div class="flex flex-col p-3">
      <div v-if="tables?.length" class="flex flex-col gap-3">
        <TableCard v-for="table in tables" :key="table.id" :table="table" />
        <button class="btn-accent">Load more</button>
      </div>
      <LoadingCard v-else />
    </div>
  </div>
</template>
