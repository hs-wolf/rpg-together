<script setup lang="ts">
import type { Table } from '@rpg-together/models'
import { DEFAULT_TABLE_BANNER, DEFAULT_USER_AVATAR } from '@rpg-together/utilities'
import { TABLE_CARD_DESCRIPTION_LENGTH } from '~/constants'
import { useFlairsStore } from '~/stores'

interface Option { name: string; label: string; icon: string; action: () => void; disabled?: boolean; extraCss?: string }

const props = defineProps<{ table: Table }>()

const localeRoute = useLocaleRoute()
const flairsStore = useFlairsStore()

const showOptions = ref(false)
const options: Option[] = [
  // {
  //   name: 'report',
  //   label: 'components.tables.card.report',
  //   icon: 'danger',
  //   action: () => report(),
  //   disabled: true,
  //   extraCss: 'text-danger',
  // },
  {
    name: 'view-owner',
    label: 'components.tables.card.view-owner',
    icon: 'user',
    action: () => viewOwner(),
  },
  {
    name: 'view-table',
    label: 'components.tables.card.view-table',
    icon: 'bar-table',
    action: () => viewTable(),
  },
]

function toggleOptions(value?: boolean) {
  showOptions.value = value ?? !showOptions.value
}

function viewTable() {
  navigateTo(localeRoute({ path: `/tables/${props.table.id}` }))
  toggleOptions(false)
}

function viewOwner() {
  navigateTo(localeRoute({ path: `/profile/${props.table.owner.id}` }))
  toggleOptions(false)
}

// TODO: Need to create the logic.
// function report() {
//   toggleOptions(false)
// }

const needToCropDescription = computed(() => props.table.description.length > TABLE_CARD_DESCRIPTION_LENGTH)
</script>

<template>
  <div class="flex flex-col w-full bg-secondary text-primary rounded-sm break-all">
    <NuxtImg
      :src="table?.banner ?? DEFAULT_TABLE_BANNER"
      :alt="table?.title"
      class="max-h-[192px] min-h-[192px] rounded-t-sm object-cover lg:max-h-[256px] lg:min-h-[256px]"
    />
    <div class="flex flex-col gap-2 h-full p-2 lg:gap-4 lg:p-4">
      <NuxtLink :to="localeRoute({ path: `/tables/${table.id}` })" class="text-lg lg:text-xl text-accent-dark font-semibold">
        {{ table.title }}
      </NuxtLink>
      <p class="font-roboto-slab whitespace-pre-line lg:text-lg">
        {{
          needToCropDescription
            ? `${table.description.substring(0, TABLE_CARD_DESCRIPTION_LENGTH).trimEnd()}...`
            : table.description
        }}
        <NuxtLink v-if="needToCropDescription" :to="localeRoute({ path: `/tables/${table.id}` })" class="font-semibold">
          {{ $t('components.tables.card.read-more') }}
        </NuxtLink>
      </p>
      <div class="flex flex-wrap gap-1 py-2">
        <div
          v-for="flair in table.flairs"
          :key="flair"
          class="flex items-center px-1 py-0.5 border border-accent-light rounded-sm text-xs text-primary-light lg:px-2 lg:py-1 lg:text-sm"
        >
          {{ flairsStore.getFlairLabel(flair) }}
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-2 mt-auto">
        <NuxtLink :to="localeRoute({ path: `/profile/${table.owner.id}` })" class="flex items-center gap-2">
          <NuxtImg
            :src="table?.owner?.avatar ?? DEFAULT_USER_AVATAR"
            :alt="table?.owner?.username"
            class="flex w-[40px] h-[40px] rounded-sm object-cover shadow lg:w-[42px] lg:h-[42px]"
          />
          <h1 class="text-sm lg:text-base font-semibold">
            {{ table?.owner?.username }}
          </h1>
        </NuxtLink>
        <button name="options" class="btn-secondary" @click.prevent="toggleOptions()">
          <NuxtIcon name="chevron-up" :class="{ 'rotate-180': !showOptions }" />
        </button>
      </div>
      <Transition name="fade">
        <div v-if="showOptions" class="flex flex-wrap justify-center pt-2 gap-4 lg:pt-4 lg:gap-6">
          <button
            v-for="option in options"
            :key="option.name"
            class="btn-effect flex flex-col items-center gap-1"
            :class="[option.extraCss, { 'opacity-50 pointer-events-none': option.disabled }]"
            @click.prevent="option.action"
          >
            <NuxtIcon :name="option.icon" class="text-xl lg:text-2xl" />
            <p class="text-sm lg:text-base">
              {{ $t(option.label) }}
            </p>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>
