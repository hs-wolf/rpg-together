<script setup lang="ts">
import type { Application, Table } from '@rpg-together/models'
import { DEFAULT_TABLE_BANNER } from '@rpg-together/utilities'
import { useApplicationsStore, useFlairsStore, useTablesStore } from '~/stores'

const localePath = useLocalePath()
const tableId = useRoute().params.id as string
const firebaseUser = useFirebase.currentUser()
const previousRoute = useRouter().options.history.state.back
const applicationsStore = useApplicationsStore()
const tablesStore = useTablesStore()
const flairsStore = useFlairsStore()

const table = ref<Table>()
const existingApplication = ref<Application | null>()
const showApplicationMenu = ref(false)

useHead({ title: () => table.value?.title ?? useNuxtApp().$i18n.t('tables.title') })

const showApplicationButton = computed(() => table.value?.owner.id !== firebaseUser.value?.uid && !existingApplication.value)

async function getExistingApplication() {
  existingApplication.value = await applicationsStore.getExistingApplication(firebaseUser.value?.uid ?? '', tableId)
}

watch(firebaseUser, async () => {
  await getExistingApplication()
})

onBeforeMount(async () => {
  table.value = await tablesStore.getTable(tableId)
  if (!table.value)
    navigateTo({ path: previousRoute?.toString() ?? '/' })
  if (firebaseUser.value)
    await getExistingApplication()
})
</script>

<template>
  <div v-if="table" class="flex flex-col lg:gap-7">
    <PageTitle :title="table?.title" :back="true" />
    <div class="flex flex-col gap-3 lg:gap-5 w-full lg:max-w-5xl lg:mx-auto lg:grid lg:grid-cols-2">
      <NuxtImg
        :src="table?.banner ?? DEFAULT_TABLE_BANNER"
        :alt="table?.title"
        width="128"
        height="128"
        sizes="sm:100vw md:50vw lg:400px"
        format="webp"
        class="w-full object-contain"
      />
      <div class="flex flex-col gap-3 px-2 lg:px-0">
        <p class="font-roboto-slab whitespace-pre-line lg:text-lg">
          {{ table?.description }}
        </p>
        <div v-if="table?.flairs && table?.flairs.length" class="flex flex-wrap items-center gap-1 lg:gap-2">
          <div
            v-for="flair in table.flairs"
            :key="flair"
            class="flex items-center px-1 lg:px-1.5 lg:py-0.5 bg-accent shadow rounded-sm text-sm lg:text-base text-secondary"
          >
            {{ flairsStore.getFlairLabel(flair) }}
          </div>
        </div>
        <div class="flex flex-col mt-3">
          <button v-if="showApplicationButton" class="btn-primary gap-2" @click.prevent="showApplicationMenu = !showApplicationMenu">
            <NuxtIcon name="apply" />
            <p>{{ $t('tables.apply-to-table') }}</p>
          </button>
          <NuxtLink v-else-if="table.owner.id === firebaseUser?.uid" :to="localePath({ path: `/editing-table/${table.id}` })" class="btn-primary gap-2">
            <NuxtIcon name="edit-pencil" />
            <p>{{ $t('tables.youre-the-owner') }}</p>
          </NuxtLink>
          <div v-else class="flex justify-center items-center lg:justify-start gap-2 text-sm lg:text-base text-center text-secondary-dark">
            <NuxtIcon name="apply" />
            <p>{{ $t('tables.already-applied') }}</p>
          </div>
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
