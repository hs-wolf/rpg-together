<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useTablesStore } from '~/stores';
import { Table } from '@rpg-together/models';

definePageMeta({ middleware: ['auth'] });
useHead({ title: useI18n().t('my-tables.title') });

const tablesStore = useTablesStore();

const tables = ref<Table[]>([]);
onMounted(async () => {
  const fetch = await tablesStore.fetchMyTables();
  if (fetch) {
    tables.value = fetch;
  }
});
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="$t('my-tables.title')" />
    <div class="flex flex-col gap-3 px-3">
      <NuxtLink :to="{ name: 'create-table' }" class="btn-accent">{{ $t('my-tables.create-table') }}</NuxtLink>
      <hr class="border-primary-light" />
    </div>
    <div class="flex flex-col gap-3 p-3">
      <MyTablesTableCard v-for="table in tables" :key="table.id" :table="(table as any)" />
    </div>
  </div>
</template>
