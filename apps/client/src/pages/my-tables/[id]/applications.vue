<script setup lang="ts">
import type { Application, Table } from '@rpg-together/models'
import { ApplicationStatus } from '@rpg-together/models'

const router = useRouter()
const tableId = useRoute().params.id as string

definePageMeta({ middleware: ['logged-in'] })

const table = ref<Table>()
const applications = ref<Application[]>([])

onBeforeMount(async () => {
  table.value = await useRpgTogetherAPI.getTable({ tableId })
  if (!table.value)
    navigateTo({ path: router.options.history.state.back?.toString() ?? '/' })
  applications.value = await useRpgTogetherAPI.getApplicationsFromTable({ tableId })
})
</script>

<template>
  <LoadingIcon v-if="!table" />
  <div v-else class="flex flex-col gap-5 lg:gap-7">
    <PageTitle :title="$t('components.my-tables.applications.title', { table: table.title })" back="my-tables" />
    <div class="flex flex-col w-full px-2 lg:px-0 lg:max-w-5xl lg:mx-auto">
      <p v-if="!applications.length" class="p-5 lg:p-7 text-sm lg:text-base text-center text-secondary-2">
        {{ $t('components.my-tables.applications.no-applications') }}
      </p>
      <div v-else class="flex flex-col gap-3">
        <MyTablesApplicationCard
          v-for="application in applications"
          :key="application.id"
          :application="application"
          @accept="application.status = ApplicationStatus.ACCEPTED"
          @decline="application.status = ApplicationStatus.DECLINED"
        />
      </div>
    </div>
  </div>
</template>
