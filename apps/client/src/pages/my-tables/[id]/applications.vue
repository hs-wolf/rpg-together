<script setup lang="ts">
import type { Application, Table } from '@rpg-together/models'
import { ApplicationStatus } from '@rpg-together/models'

const router = useRouter()
const tableId = useRoute().params.id as string
const localePath = useLocalePath()

definePageMeta({ middleware: ['logged-in'] })

const table = ref<Table>()
const applications = ref<Application[]>([])
const madeFirstSearch = ref(false)

onBeforeMount(async () => {
  table.value = await useRpgTogetherAPI.getTable({ tableId })
  if (!table.value)
    navigateTo({ path: router.options.history.state.back?.toString() ?? '/' })
  applications.value = await useRpgTogetherAPI.getApplicationsFromTable({ tableId })
  madeFirstSearch.value = true
})
</script>

<template>
  <div class="flex flex-col gap-5 lg:pt-9 lg:gap-9">
    <PageTitle :title="$t('components.my-tables.applications.title', { table: table?.title })" back="my-tables" />
    <div class="flex flex-col w-full gap-5 lg:gap-9 px-2 lg:px-0 lg:max-w-5xl lg:mx-auto">
      <i18n-t
        keypath="components.my-tables.applications.title"
        tag="p"
        scope="global"
        class="lg:text-lg"
      >
        <template #table>
          <NuxtLink :to="localePath({ path: `/tables/${table?.id}` })" class="font-semibold text-accent-2">
            {{ table?.title }}
          </NuxtLink>
        </template>
      </i18n-t>
      <LoadingCard v-if="!madeFirstSearch" />
      <p v-else-if="!applications.length" class="p-5 lg:p-9 bg-primary-1 rounded-sm text-sm lg:text-base text-center text-secondary-2">
        {{ $t('components.my-tables.applications.no-applications') }}
      </p>
      <div v-else class="flex flex-col gap-3 lg:gap-5">
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
