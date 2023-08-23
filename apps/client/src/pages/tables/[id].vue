<script setup lang="ts">
import type { Application, Table } from '@rpg-together/models'
import { DEFAULT_TABLE_BANNER } from '@rpg-together/utilities'
import { useFlairsStore, useTablesStore } from '~/stores'

const { t } = useI18n()
const localePath = useLocalePath()
const tableId = useRoute().params.id as string
const firebaseUser = useFirebase.currentUser()
const previousRoute = useRouter().options.history.state.back
const tablesStore = useTablesStore()
const flairsStore = useFlairsStore()
const table = ref<Table>()
const existingApplication = ref<Application | null>(null)

useHead({ title: () => table.value?.title ?? t('tables.title') })

onBeforeMount(async () => {
  table.value = await tablesStore.getTable(tableId)
  if (!table.value)
    navigateTo({ path: previousRoute?.toString() ?? '/' })

  if (firebaseUser.value)
    await getExistingApplication()
})

watch(firebaseUser, async () => {
  await getExistingApplication()
})

async function getExistingApplication() {
  existingApplication.value = await useRpgTogetherAPI.getApplicationFromTableAndUser({
    tableId,
    userId: firebaseUser.value?.uid ?? '',
  })
}

const showApplicationButton = computed(() => table.value?.owner.id !== firebaseUser.value?.uid && !existingApplication.value)

const showApplicationMenu = ref(false)
</script>

<template>
  <div v-if="table" class="flex flex-col h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="table?.title" :back="true" />
    <div class="flex flex-col m-3 mb-5">
      <div v-if="showApplicationButton" class="flex flex-col gap-1">
        <button class="btn-primary gap-1" @click.prevent="showApplicationMenu = !showApplicationMenu">
          <NuxtIcon name="apply" />
          <p>{{ $t('tables.apply-to-table') }}</p>
        </button>
      </div>
      <div v-else-if="table.owner.id === firebaseUser?.uid" class="flex flex-col gap-1">
        <NuxtLink :to="localePath({ path: `/editing-table/${table.id}` })" class="btn-primary gap-1">
          <NuxtIcon name="edit-pencil" />
          <p>{{ $t('tables.youre-the-owner') }}</p>
        </NuxtLink>
      </div>
      <div v-else class="flex justify-center items-center gap-1 text-sm text-center text-secondary-dark">
        <NuxtIcon name="apply" />
        <p>{{ $t('tables.already-applied') }}</p>
      </div>
    </div>
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
      <h1 class="font-semibold">
        {{ $t('tables.description') }}
      </h1>
      <p class="font-roboto-slab whitespace-pre-line">
        {{ table?.description }}
      </p>
    </div>
    <div class="flex flex-col gap-1 p-3">
      <p class="font-semibold">
        {{ $t('my-tables-table-card.flairs') }}
      </p>
      <div v-if="table?.flairs && table?.flairs.length" class="flex flex-wrap items-center gap-2">
        <div
          v-for="flair in table.flairs"
          :key="flair"
          class="flex items-center px-1.5 py-1 bg-accent shadow rounded-sm text-sm text-secondary"
        >
          {{ flairsStore.getFlairLabel(flair) }}
        </div>
      </div>
    </div>
    <TablesApply
      :show="showApplicationMenu"
      :table="table"
      @close="showApplicationMenu = false"
      @update-existing="getExistingApplication()"
    />
  </div>
</template>
