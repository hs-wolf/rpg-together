<script setup lang="ts">
import type { Table } from '@rpg-together/models'
import { LIMIT_OF_TABLES } from '@rpg-together/utilities'
import { useTablesStore } from '~/stores'

definePageMeta({ middleware: ['logged-in'] })
useHead({ title: useNuxtApp().$i18n.t('components.my-tables.title') })

const localePath = useLocalePath()
const tablesStore = useTablesStore()
const { myTables } = storeToRefs(tablesStore)

const enableCreateTable = computed(() => (!(myTables.value.length >= LIMIT_OF_TABLES)))

const tableToDelete = ref<Table>()
const madeFirstSearch = ref(false)

onMounted(async () => {
  if (!myTables.value.length)
    await tablesStore.getUserTables({ save: true })
  madeFirstSearch.value = true
})
</script>

<template>
  <div class="flex flex-col gap-5 lg:pt-9 lg:gap-9">
    <PageTitle :title="$t('components.my-tables.title')" />
    <div class="flex flex-col w-full px-2 lg:px-0 lg:max-w-5xl lg:mx-auto">
      <LoadingCard v-if="!madeFirstSearch" />
      <div v-else class="flex flex-col gap-5 lg:gap-9">
        <div class="flex justify-between items-center gap-3 lg:gap-5">
          <i18n-t keypath="components.my-tables.tables-limit" tag="p" scope="global" class="text-sm lg:text-base">
            <template #limit>
              <span class="font-semibold">{{ `${myTables.length} / ${LIMIT_OF_TABLES}` }}</span>
            </template>
          </i18n-t>
          <NuxtLink
            :to="localePath({ name: 'create-table' })"
            class="btn btn-action w-auto"
            :class="{ 'opacity-50 pointer-events-none': !enableCreateTable }"
          >
            {{ $t('components.my-tables.create-table') }}
          </NuxtLink>
        </div>
        <div class="flex flex-col gap-3 lg:gap-5">
          <MyTablesTableCard
            v-for="table in myTables"
            :key="table.id"
            :table="table"
            @delete="(table: Table) => (tableToDelete = table)"
          />
        </div>
      </div>
    </div>
    <Transition name="fade">
      <MyTablesDeleteTableModal v-if="tableToDelete" :table="tableToDelete" @close="tableToDelete = undefined" />
    </Transition>
  </div>
</template>
