<script setup lang="ts">
import type { Table } from '@rpg-together/models'
import { DEFAULT_TABLE_BANNER, DEFAULT_USER_AVATAR } from '@rpg-together/utilities'
import { TABLE_CARD_DESCRIPTION_LENGTH } from '~/constants'
import { useFlairsStore } from '~/stores'

interface Option {
  name: string
  label: string
  icon: string
  action: () => void
  theme: 'btn-primary' | 'btn-secondary' | 'btn-danger' | 'btn-action'
  disabled?: boolean
}

const props = defineProps<{ table: Table }>()

const localeRoute = useLocaleRoute()
const flairsStore = useFlairsStore()

const options: Option[] = [
  {
    name: 'report',
    label: 'components.tables.card.report',
    icon: 'danger',
    action: () => report(),
    disabled: true,
    theme: 'btn-danger',
  },
  {
    name: 'view-owner',
    label: 'components.tables.card.view-owner',
    icon: 'user',
    action: () => viewOwner(),
    theme: 'btn-secondary',
  },
  {
    name: 'view-table',
    label: 'components.tables.card.view-table',
    icon: 'bar-table',
    action: () => viewTable(),
    theme: 'btn-secondary',
  },
]

const showOptions = ref(false)

const descriptionNeedCropping = computed(() => props.table.description.length > TABLE_CARD_DESCRIPTION_LENGTH)

const croppedDescription = computed(() =>
  descriptionNeedCropping.value
    ? `${props.table.description.substring(0, TABLE_CARD_DESCRIPTION_LENGTH).trimEnd()}...`
    : props.table.description)

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
function report() {
  // eslint-disable-next-line no-alert
  alert('Not implemented yet.')
  toggleOptions(false)
}
</script>

<template>
  <div class="flex flex-col w-full bg-secondary text-primary rounded-sm break-words">
    <NuxtImg
      :src="table?.banner ?? DEFAULT_TABLE_BANNER"
      :alt="table?.title"
      class="h-[192px] lg:h-[256px] rounded-t-sm object-cover"
    />
    <div class="flex flex-col gap-2 p-2 lg:gap-3 lg:p-3">
      <NuxtLink :to="localeRoute({ path: `/tables/${table.id}` })" class="btn-effect self-start text-xl lg:text-2xl text-accent font-semibold">
        {{ table.title }}
      </NuxtLink>
      <p class="font-roboto-slab whitespace-pre-line lg:text-lg">
        {{ croppedDescription }}
        <NuxtLink v-if="descriptionNeedCropping" :to="localeRoute({ path: `/tables/${table.id}` })" class="font-semibold">
          {{ $t('components.tables.card.read-more') }}
        </NuxtLink>
      </p>
      <div class="flex flex-wrap gap-1 lg:gap-2 mt-2 lg:mt-3">
        <div
          v-for="flair in table.flairs"
          :key="flair"
          class="flex items-center px-1 py-0.5 bg-accent rounded-sm text-xs text-secondary lg:px-1.5 lg:py-1 lg:text-sm"
        >
          {{ flairsStore.getFlairLabel(flair) }}
        </div>
      </div>
      <div class="flex flex-wrap justify-between items-center gap-2 mt-2 lg:mt-3 lg:gap-3">
        <NuxtLink :to="localeRoute({ path: `/profile/${table.owner.id}` })" class="flex items-center gap-2">
          <NuxtImg
            :src="table?.owner?.avatar ?? DEFAULT_USER_AVATAR"
            :alt="table?.owner?.username"
            class="flex w-[34px] h-[34px] rounded-sm object-cover shadow"
          />
          <h1 class="text-sm lg:text-base font-semibold">
            {{ table?.owner?.username }}
          </h1>
        </NuxtLink>
        <button name="options" class="btn btn-secondary w-auto" @click.prevent="toggleOptions()">
          <NuxtIcon name="chevron-up" class="transition-transform" :class="{ ' rotate-180': !showOptions }" />
        </button>
      </div>
      <Transition name="fade">
        <div v-if="showOptions" class="flex flex-wrap items-center gap-2 lg:gap-3">
          <button
            v-for="option in options"
            :key="option.name"
            class="btn w-auto"
            :class="option.theme"
            :disabled="option.disabled"
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
