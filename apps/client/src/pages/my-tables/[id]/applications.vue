<script setup lang="ts">
import { Application, ApplicationStatus, Table } from '@rpg-together/models';

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
    <p v-if="!applications.length" class="p-3 text-sm text-center text-secondary-dark">
      {{ $t('my-tables-applications.no-applications') }}
    </p>
    <div v-else class="flex flex-col gap-3 p-3">
      <MyTablesApplicationCard
        v-for="application in applications"
        :key="application.id"
        :application="application"
        @accept="application.status = ApplicationStatus.ACCEPTED"
        @decline="application.status = ApplicationStatus.DECLINED"
      />
    </div>
  </div>
</template>
