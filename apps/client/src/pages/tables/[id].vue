<script setup lang="ts">
import { useTablesStore, useFlairsStore } from '~/stores';
import { Table } from '@rpg-together/models';
import { DEFAULT_TABLE_BANNER } from '@rpg-together/utils';

const { t } = useI18n();
const tableId = useRoute().params.id as string;
const previousRoute = useRouter().options.history.state.back;
const tablesStore = useTablesStore();
const flairsStore = useFlairsStore();
const table = ref<Table>();

useHead({ title: () => table.value?.title ?? t('tables.title') });

onMounted(async () => {
  table.value = await tablesStore.fetchTable(tableId);
  if (!table.value) {
    navigateTo({ path: previousRoute?.toString() ?? '/' });
  }
});
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="table?.title" :back="true" />
    <NuxtImg
      :src="table?.banner ?? DEFAULT_TABLE_BANNER"
      :alt="table?.title"
      width="128"
      height="128"
      sizes="sm:100vw md:50vw lg:400px"
      format="webp"
      class="w-full h-64 rounded-t-sm object-cover"
    />
    <div class="flex flex-col gap-1 p-3 bg-secondary text-primary">
      <h1 class="font-semibold">{{ $t('tables.description') }}</h1>
      <p class="font-roboto-slab whitespace-pre-line">{{ table?.description }}</p>
    </div>
    <div class="flex flex-col gap-1 p-3">
      <p class="font-semibold">{{ $t('my-tables-table-card.flairs') }}</p>
      <div v-if="table?.flairs && table?.flairs.length" class="flex flex-wrap items-center gap-2">
        <div
          v-for="flair in table.flairs"
          class="flex items-center px-1.5 py-1 bg-accent shadow rounded-sm text-sm text-secondary"
        >
          {{ flairsStore.getFlairLabel(flair) }}
        </div>
      </div>
    </div>
  </div>
</template>
