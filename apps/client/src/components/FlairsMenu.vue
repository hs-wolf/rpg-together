<script setup lang="ts">
import type { AdvancedSelectOption } from '~/types'
import { useFlairsStore } from '~/stores'

const props = defineProps<{ open?: boolean; modelValue?: string[] }>()

const emits = defineEmits<{ (_e: 'update:modelValue', _values: string[]): void }>()

const flairsStore = useFlairsStore()
const { systemsFlairs, languagesFlairs, ratingsFlairs, vacanciesFlairs, genresFlairs } = storeToRefs(flairsStore)

const showFilterMenu = ref(props.open)
const systemsFilterRef = ref()
const languagesFilterRef = ref()
const ratingsFilterRef = ref()
const vacanciesFilterRef = ref()
const genresFilterRef = ref()
const selectedSystems = ref<AdvancedSelectOption[]>([])
const selectedLanguages = ref<AdvancedSelectOption[]>([])
const selectedRatings = ref<AdvancedSelectOption[]>([])
const selectedVacancies = ref<AdvancedSelectOption[]>([])
const selectedGenres = ref<AdvancedSelectOption[]>([])

function clearFilters() {
  systemsFilterRef.value.clearOptions()
  languagesFilterRef.value.clearOptions()
  ratingsFilterRef.value.clearOptions()
  vacanciesFilterRef.value.clearOptions()
  genresFilterRef.value.clearOptions()
}

function setInitialFlairs() {
  selectedSystems.value = flairsStore.mapFlairsToAdvancedSelectOption(
    systemsFlairs.value.filter((flair) => {
      return props.modelValue?.includes(flair.id)
    }),
  )
  selectedLanguages.value = flairsStore.mapFlairsToAdvancedSelectOption(
    languagesFlairs.value.filter((flair) => {
      return props.modelValue?.includes(flair.id)
    }),
  )
  selectedRatings.value = flairsStore.mapFlairsToAdvancedSelectOption(
    ratingsFlairs.value.filter((flair) => {
      return props.modelValue?.includes(flair.id)
    }),
  )
  selectedVacancies.value = flairsStore.mapFlairsToAdvancedSelectOption(
    vacanciesFlairs.value.filter((flair) => {
      return props.modelValue?.includes(flair.id)
    }),
  )
  selectedGenres.value = flairsStore.mapFlairsToAdvancedSelectOption(
    genresFlairs.value.filter((flair) => {
      return props.modelValue?.includes(flair.id)
    }),
  )
}

watch([selectedSystems, selectedLanguages, selectedRatings, selectedVacancies, selectedGenres], () => {
  const ids = [
    ...selectedSystems.value.map(option => option.id ?? option.name),
    ...selectedLanguages.value.map(option => option.id ?? option.name),
    ...selectedRatings.value.map(option => option.id ?? option.name),
    ...selectedVacancies.value.map(option => option.id ?? option.name),
    ...selectedGenres.value.map(option => option.id ?? option.name),
  ]
  emits('update:modelValue', ids)
}, { deep: true })

onMounted(() => setInitialFlairs())
</script>

<template>
  <div class="flex flex-col gap-2 overflow-hidden">
    <div class="flex justify-between">
      <button class="btn btn-secondary w-auto" @click.prevent="showFilterMenu = !showFilterMenu">
        <NuxtIcon name="filter" />
        <p>{{ $t('components.flairs-menu.flairs') }}</p>
        <NuxtIcon name="chevron-left" fill class="transition-transform" :class="{ 'rotate-180': !showFilterMenu }" />
      </button>
      <Transition name="slide-left">
        <button v-if="showFilterMenu" class="btn btn-warning w-auto" @click.prevent="clearFilters">
          <p>{{ $t('components.flairs-menu.clear') }}</p>
          <NuxtIcon name="x-close" />
        </button>
      </Transition>
    </div>
    <Transition name="slide-left">
      <div v-if="showFilterMenu" class="flex flex-wrap items-start gap-2">
        <FormSelect
          ref="systemsFilterRef"
          v-model="selectedSystems"
          :options="flairsStore.mapFlairsToAdvancedSelectOption(systemsFlairs)"
          placeholder="Systems"
          :search-message="$t('components.flairs-menu.search-flair')"
          :empty-message="$t('components.flairs-menu.no-options-left')"
        />
        <FormSelect
          ref="languagesFilterRef"
          v-model="selectedLanguages"
          :options="flairsStore.mapFlairsToAdvancedSelectOption(languagesFlairs)"
          placeholder="Languages"
          :search-message="$t('components.flairs-menu.search-flair')"
          :empty-message="$t('components.flairs-menu.no-options-left')"
        />
        <FormSelect
          ref="ratingsFilterRef"
          v-model="selectedRatings"
          :options="flairsStore.mapFlairsToAdvancedSelectOption(ratingsFlairs)"
          placeholder="Ratings"
          :search-message="$t('components.flairs-menu.search-flair')"
          :empty-message="$t('components.flairs-menu.no-options-left')"
        />
        <FormSelect
          ref="vacanciesFilterRef"
          v-model="selectedVacancies"
          :options="flairsStore.mapFlairsToAdvancedSelectOption(vacanciesFlairs)"
          placeholder="Vacancies"
          :search-message="$t('components.flairs-menu.search-flair')"
          :empty-message="$t('components.flairs-menu.no-options-left')"
        />
        <FormSelect
          ref="genresFilterRef"
          v-model="selectedGenres"
          :options="flairsStore.mapFlairsToAdvancedSelectOption(genresFlairs)"
          placeholder="Genres"
          :search-message="$t('components.flairs-menu.search-flair')"
          :empty-message="$t('components.flairs-menu.no-options-left')"
        />
      </div>
    </Transition>
  </div>
</template>
