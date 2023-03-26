<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useApplicationsStore } from '~/stores';
import { LIMIT_OF_APPLICATIONS, DEFAULT_TABLE_BANNER } from '@rpg-together/utils';

definePageMeta({ middleware: ['logged-in'] });
useHead({ title: useI18n().t('my-applications.title') });

const applicationsStore = useApplicationsStore();
const { myApplications } = storeToRefs(applicationsStore);

onMounted(async () => {
  if (!myApplications.value.length) {
    await applicationsStore.fetchMyApplications({ save: true });
  }
});
</script>

<template>
  <div class="flex flex-col h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('my-applications.title')" />
    <div class="flex justify-between items-center gap-3 p-3">
      <i18n-t keypath="my-applications.applications-limit" tag="p" scope="global" class="text-sm leading-none">
        <template v-slot:limit>
          <span class="font-semibold">{{ `${myApplications.length} / ${LIMIT_OF_APPLICATIONS}` }}</span>
        </template>
      </i18n-t>
    </div>
    <div class="flex flex-col gap-3 p-3">
      <MyApplicationsApplicationCard v-for="application in myApplications" :key="application.id" :application="application" />
    </div>
  </div>
</template>
