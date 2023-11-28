<script setup lang="ts">
import type { Table } from '@rpg-together/models'
import { LIMIT_OF_TABLES } from '@rpg-together/utilities'
import { useTablesStore } from '~/stores'

definePageMeta({ middleware: ['logged-in'] })
useHead({ title: useNuxtApp().$i18n.t('my-tables.title') })

const localePath = useLocalePath()
const tablesStore = useTablesStore()
const { myTables } = storeToRefs(tablesStore)

const enableCreateTable = computed(() => (!(myTables.value.length >= LIMIT_OF_TABLES)))

const tableToDelete = ref<Table>()

onMounted(async () => {
  if (!myTables.value.length)
    await tablesStore.getUserTables({ save: true })
})
</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('my-tables.title')" />
    <div class="flex justify-between items-center gap-2 px-2">
      <i18n-t keypath="my-tables.tables-limit" tag="p" scope="global" class="text-sm leading-none">
        <template #limit>
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
    <div class="flex flex-col gap-4 px-2">
      <MyTablesTableCard
        v-for="table in myTables"
        :key="table.id"
        :table="table"
        @delete="(table: Table) => (tableToDelete = table)"
      />
    </div>
    <MyTablesDeleteTableModal :table="tableToDelete" @close="tableToDelete = undefined" />
  </div>
</template>
