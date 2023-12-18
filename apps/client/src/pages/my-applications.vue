<script setup lang="ts">
import { LIMIT_OF_APPLICATIONS } from '@rpg-together/utilities'
import { useApplicationsStore } from '~/stores'

const { t } = useNuxtApp().$i18n
const applicationsStore = useApplicationsStore()
const { myApplications } = storeToRefs(applicationsStore)

const madeFirstSearch = ref(false)

definePageMeta({ middleware: ['logged-in'] })

useHead({ title: t('pages.my-applications.title') })

onMounted(async () => {
  if (!myApplications.value.length)
    await applicationsStore.fetchMyApplications({ save: true })
  madeFirstSearch.value = true
})
</script>

<template>
  <div class="flex flex-col gap-5 lg:pt-9 lg:gap-9">
    <PageTitle :title="$t('pages.my-applications.title')" />
    <div class="flex flex-col w-full px-2 lg:px-0 lg:max-w-5xl lg:mx-auto">
      <LoadingCard v-if="!madeFirstSearch" />
      <div v-else class="flex flex-col gap-5 lg:gap-9">
        <i18n-t keypath="pages.my-applications.applications-limit" tag="p" scope="global" class="text-sm lg:text-base">
          <template #limit>
            <span class="font-semibold">{{ `${myApplications.length} / ${LIMIT_OF_APPLICATIONS}` }}</span>
          </template>
        </i18n-t>
        <div class="flex flex-col gap-3 lg:gap-5">
          <MyApplicationsApplicationCard v-for="application in myApplications" :key="application.id" :application="application" />
        </div>
      </div>
    </div>
  </div>
</template>
