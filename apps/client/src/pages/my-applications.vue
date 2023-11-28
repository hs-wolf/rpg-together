<script setup lang="ts">
import { LIMIT_OF_APPLICATIONS } from '@rpg-together/utilities'
import { useApplicationsStore } from '~/stores'

definePageMeta({ middleware: ['logged-in'] })
useHead({ title: useNuxtApp().$i18n.t('my-applications.title') })

const applicationsStore = useApplicationsStore()
const { myApplications } = storeToRefs(applicationsStore)

onMounted(async () => {
  if (!myApplications.value.length)
    await applicationsStore.fetchMyApplications({ save: true })
})
</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('my-applications.title')" />
    <div class="flex justify-between items-center gap-4 px-2">
      <i18n-t keypath="my-applications.applications-limit" tag="p" scope="global" class="text-sm leading-none">
        <template #limit>
          <span class="font-semibold">{{ `${myApplications.length} / ${LIMIT_OF_APPLICATIONS}` }}</span>
        </template>
      </i18n-t>
    </div>
    <div class="flex flex-col gap-4 px-2">
      <MyApplicationsApplicationCard v-for="application in myApplications" :key="application.id" :application="application" />
    </div>
  </div>
</template>
