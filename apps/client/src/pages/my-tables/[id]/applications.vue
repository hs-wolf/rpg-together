<script setup lang="ts">
import { Application, Table } from '@rpg-together/models';

const router = useRouter();
const tableId = useRoute().params.id as string;

definePageMeta({ middleware: ['logged-in'] });

const table = ref<Table>();
const applications = ref<Application[]>([]);

onBeforeMount(async () => {
  table.value = await useRpgTogetherAPI.getTable({ tableId });
  if (!table.value) {
    navigateTo({ path: router.options.history.state.back?.toString() ?? '/' });
  }
  applications.value = await useRpgTogetherAPI.getApplicationsFromTable({ tableId });
});
</script>

<template>
  <LoadingIcon v-if="!table" />
  <div v-else class="flex flex-col h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('my-tables-applications.title', { table: table.title })" back="my-tables" />
    <MyTablesApplicationCard v-for="application in applications" :key="application.id" :application="application" />
  </div>
</template>
