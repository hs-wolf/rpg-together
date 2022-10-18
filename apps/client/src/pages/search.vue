<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { MultiSelectOption } from '~~/types';
import { useTablesStore } from '~/stores';

useHead({ title: useI18n().t('search.title') });

const tablesStore = useTablesStore();
const query = ref('');

// TODO: Change any for the table class.
const tables = ref<any[]>();
onMounted(() => {
  tables.value = tablesStore.getFeaturedTables();
});

const showFilterMenu = ref(true);
const genresFilterRef = ref();
const systemsFilterRef = ref();
const languagesFilterRef = ref();
const ratingsFilterRef = ref();
const vacanciesFilterRef = ref();

const systemsList = [
  {
    name: 'custom',
    label: 'Custom',
  },
  {
    name: 'd&d-5e',
    label: 'D&D 5e',
  },
  {
    name: '7th-sea',
    label: '7th Sea',
  },
  {
    name: 'pathfinder',
    label: 'Pathfinder',
  },
  {
    name: 'cyberpunk-2022',
    label: 'Cyberpunk 2022',
  },
];
const languagesList = [
  {
    name: 'en',
    label: 'English',
  },
  {
    name: 'pt',
    label: 'Portuguese',
  },
];
const contentRatingsList = [
  {
    name: 'everyone',
    label: 'Everyone 13+',
  },
  {
    name: 'teen',
    label: 'Teen 16+',
  },
  {
    name: 'mature',
    label: 'Mature 18+',
  },
];
const vacanciesList = [
  {
    name: '1to2',
    label: '1 to 2',
  },
  {
    name: '3to4',
    label: '3 to 5',
  },
  {
    name: '5plus',
    label: '5 or more',
  },
];
const genresList = [
  {
    name: 'dungeon-crawling',
    label: 'Dungeon Crawling',
  },
  {
    name: 'slice-of-life',
    label: 'Slice of Life',
  },
  {
    name: 'epic-adventure',
    label: 'Epic Adventure',
  },
  {
    name: 'other',
    label: 'Other',
  },
];

const selectedFilters = reactive<{
  genres: MultiSelectOption[];
  systems: MultiSelectOption[];
  languages: MultiSelectOption[];
  ratings: MultiSelectOption[];
  vacancies: MultiSelectOption[];
}>({
  genres: [],
  systems: [],
  languages: [],
  ratings: [],
  vacancies: [],
});

const clearFilters = () => {
  genresFilterRef.value.clearItems();
  systemsFilterRef.value.clearItems();
  languagesFilterRef.value.clearItems();
  ratingsFilterRef.value.clearItems();
  vacanciesFilterRef.value.clearItems();
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-center items-center gap-2 h-24 px-3 pt-3 text-xl text-accent tracking-widest font-semibold">
      <nuxt-icon name="logo" />
      <p>{{ $t('search.title') }}</p>
    </div>
    <div class="flex flex-col gap-3 p-3">
      <div class="relative flex items-center border border-primary-light rounded">
        <nuxt-icon name="search" class="absolute left-0 px-3 py-2 pointer-events-none" />
        <input
          type="text"
          v-model="query"
          placeholder="Search"
          class="w-full h-full px-[42px] py-2 outline-none bg-transparent"
        />
        <button
          class="absolute right-0 flex px-3 py-2 opacity-50 transition-transform active:rotate-90"
          @click.prevent="query = ''"
        >
          <nuxt-icon name="close" />
        </button>
      </div>
      <div class="flex flex-col items-start gap-2">
        <button class="btn-accent gap-1.5" @click.prevent="showFilterMenu = !showFilterMenu">
          <nuxt-icon name="filter" />
          <p>Filters</p>
          <nuxt-icon name="chevron-up" fill class="transition-transform rotate-90" :class="{ '-rotate-90': showFilterMenu }" />
        </button>
        <transition name="slide-left">
          <div v-if="showFilterMenu" class="flex flex-col items-start gap-2">
            <div class="flex flex-wrap items-start gap-2">
              <multi-select
                ref="systemsFilterRef"
                :options="systemsList"
                placeholder="Systems"
                :initialValue="selectedFilters.systems"
                @changeOptions="(options) => (selectedFilters.systems = options)"
              />
              <multi-select
                ref="languagesFilterRef"
                :options="languagesList"
                placeholder="Languages"
                :initialValue="selectedFilters.languages"
                @changeOptions="(options) => (selectedFilters.languages = options)"
              />
              <multi-select
                ref="ratingsFilterRef"
                :options="contentRatingsList"
                placeholder="Ratings"
                :initialValue="selectedFilters.ratings"
                @changeOptions="(options) => (selectedFilters.ratings = options)"
              />
              <multi-select
                ref="vacanciesFilterRef"
                :options="vacanciesList"
                placeholder="Vacancies"
                :initialValue="selectedFilters.vacancies"
                @changeOptions="(options) => (selectedFilters.vacancies = options)"
              />
              <multi-select
                ref="genresFilterRef"
                :options="genresList"
                placeholder="Genres"
                :initialValue="selectedFilters.genres"
                @changeOptions="(options) => (selectedFilters.genres = options)"
              />
            </div>
            <button class="btn-secondary gap-2" @click.prevent="clearFilters">
              <p>Reset</p>
              <nuxt-icon name="close" />
            </button>
          </div>
        </transition>
      </div>
    </div>
    <i18n-t v-if="!query" keypath="search.results-for" tag="h1" class="p-3 text-sm text-center">
      <template v-slot:amount>
        <span class="font-semibold">{{ tables?.length }}</span>
      </template>
      <template v-slot:query>
        <span class="font-semibold">{{ query }}</span>
      </template>
    </i18n-t>
    <div class="flex flex-col gap-3 p-3">
      <table-card v-for="table in tables" :key="table.id" :table="table" />
    </div>
  </div>
</template>
