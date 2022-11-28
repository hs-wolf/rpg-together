<script setup lang="ts">
import { AdvancedSelectOption } from '~/types';
import { useFlairsStore } from '~/stores';

const flairsStore = useFlairsStore();
const { allFlairs, systemsFlairs, languagesFlairs, ratingsFlairs, vacanciesFlairs, genresFlairs } = storeToRefs(flairsStore);

const props = defineProps<{ open?: boolean }>();
const emits = defineEmits<{ (e: 'change', values: string[]): void }>();

const showFilterMenu = ref(props.open);
const systemsFilterRef = ref();
const languagesFilterRef = ref();
const ratingsFilterRef = ref();
const vacanciesFilterRef = ref();
const genresFilterRef = ref();

const selectedFilters = reactive<{
  systems: AdvancedSelectOption[];
  languages: AdvancedSelectOption[];
  ratings: AdvancedSelectOption[];
  vacancies: AdvancedSelectOption[];
  genres: AdvancedSelectOption[];
}>({
  systems: [],
  languages: [],
  vacancies: [],
  ratings: [],
  genres: [],
});

const clearFilters = () => {
  systemsFilterRef.value.clearOptions();
  languagesFilterRef.value.clearOptions();
  ratingsFilterRef.value.clearOptions();
  vacanciesFilterRef.value.clearOptions();
  genresFilterRef.value.clearOptions();
};

watch(selectedFilters, () => {
  const ids = [
    ...selectedFilters.systems.map((option) => option.id ?? option.name),
    ...selectedFilters.languages.map((option) => option.id ?? option.name),
    ...selectedFilters.ratings.map((option) => option.id ?? option.name),
    ...selectedFilters.vacancies.map((option) => option.id ?? option.name),
    ...selectedFilters.genres.map((option) => option.id ?? option.name),
  ];
  emits('change', ids);
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between">
      <button class="btn-primary gap-2" @click.prevent="showFilterMenu = !showFilterMenu">
        <Icon name="material-symbols:filter-alt" />
        <p>{{ $t('flairs-menu.flairs') }}</p>
        <Icon name="ion:chevron-left" fill class="transition-transform" :class="{ 'rotate-180': showFilterMenu }" />
      </button>
      <Transition name="slide-left">
        <button v-if="showFilterMenu" class="btn-primary gap-2" @click.prevent="clearFilters">
          <p>{{ $t('flairs-menu.clear') }}</p>
          <Icon name="material-symbols:close" />
        </button>
      </Transition>
    </div>
    <Transition name="slide-left">
      <div v-if="showFilterMenu" class="flex flex-wrap items-start gap-2">
        <FormSelect
          ref="systemsFilterRef"
          :options="systemsFlairs"
          :initialValue="selectedFilters.systems"
          placeholderMessage="Systems"
          :searchMessage="$t('flairs-menu.search-flair')"
          :emptyMessage="$t('flairs-menu.no-options-left')"
          @change="(options: AdvancedSelectOption[]) => (selectedFilters.systems = options)"
        />
        <FormSelect
          ref="languagesFilterRef"
          :options="languagesFlairs"
          :initialValue="selectedFilters.languages"
          placeholderMessage="Languages"
          :searchMessage="$t('flairs-menu.search-flair')"
          :emptyMessage="$t('flairs-menu.no-options-left')"
          @change="(options: AdvancedSelectOption[]) => (selectedFilters.languages = options)"
        />
        <FormSelect
          ref="ratingsFilterRef"
          :options="ratingsFlairs"
          :initialValue="selectedFilters.ratings"
          placeholderMessage="Ratings"
          :searchMessage="$t('flairs-menu.search-flair')"
          :emptyMessage="$t('flairs-menu.no-options-left')"
          @change="(options: AdvancedSelectOption[]) => (selectedFilters.ratings = options)"
        />
        <FormSelect
          ref="vacanciesFilterRef"
          :options="vacanciesFlairs"
          :initialValue="selectedFilters.vacancies"
          placeholderMessage="Vacancies"
          :searchMessage="$t('flairs-menu.search-flair')"
          :emptyMessage="$t('flairs-menu.no-options-left')"
          @change="(options: AdvancedSelectOption[]) => (selectedFilters.vacancies = options)"
        />
        <FormSelect
          ref="genresFilterRef"
          :options="genresFlairs"
          :initialValue="selectedFilters.genres"
          placeholderMessage="Genres"
          :searchMessage="$t('flairs-menu.search-flair')"
          :emptyMessage="$t('flairs-menu.no-options-left')"
          @change="(options: AdvancedSelectOption[]) => (selectedFilters.genres = options)"
        /></div
    ></Transition>
  </div>
</template>
