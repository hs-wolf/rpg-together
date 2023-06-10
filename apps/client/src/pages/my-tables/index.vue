<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useTablesStore } from '~/stores';
import { Table } from '@rpg-together/models';
import { LIMIT_OF_TABLES } from '@rpg-together/utils';

definePageMeta({ middleware: ['logged-in'] });
useHead({ title: useI18n().t('my-tables.title') });

const localePath = useLocalePath();
const tablesStore = useTablesStore();
const { myTables } = storeToRefs(tablesStore);

const enableCreateTable = computed(() => (myTables.value.length >= LIMIT_OF_TABLES ? false : true));

const tableToDelete = ref<Table>();

onMounted(async () => {
  if (!myTables.value.length) {
    await tablesStore.fetchMyTables({ save: true });
  }
});
</script>

<template>
  <div class="flex flex-col h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('my-tables.title')" />
    <div class="flex justify-between items-center gap-3 p-3">
      <i18n-t keypath="my-tables.tables-limit" tag="p" scope="global" class="text-sm leading-none">
        <template v-slot:limit>
          <span class="font-semibold">{{ `${myTables.length} / ${LIMIT_OF_TABLES}` }}</span>
        </template>
      </i18n-t>
      <NuxtLink
        :to="localePath({ name: 'create-table' })"
        :class="enableCreateTable ? 'btn-accent' : 'btn-primary opacity-50 pointer-events-none'"
      >
        {{ $t('my-tables.create-table') }}
      </NuxtLink>
    </div>
    <div class="flex flex-col gap-3 p-3">
      <MyTablesTableCard
        v-for="table in myTables"
        :key="table.id"
        :table="(table as any)"
        @delete="(table: Table) => (tableToDelete = table)"
      />
    </div>
    <MyTablesDeleteTableModal :table="tableToDelete" @close="tableToDelete = undefined" />
  </div>
</template>
