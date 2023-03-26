<script setup lang="ts">
import { TABLE_CARD_DESCRIPTION_LENGTH } from '~/constants';
import { useTablesStore, useFlairsStore } from '~/stores';
import { Table } from '@rpg-together/models';
import { DEFAULT_USER_AVATAR, DEFAULT_TABLE_BANNER } from '@rpg-together/utils';

const props = defineProps<{ table: Table }>();

const localeRoute = useLocaleRoute();
const tablesStore = useTablesStore();
const flairsStore = useFlairsStore();

const showOptions = ref(false);

const needToCropDescription = computed(() => props.table.description.length > TABLE_CARD_DESCRIPTION_LENGTH);
</script>

<template>
  <div class="relative flex flex-col bg-secondary rounded text-primary break-all">
    <NuxtImg
      :src="table?.banner ?? DEFAULT_TABLE_BANNER"
      :alt="table?.title"
      width="auto"
      height="192px"
      class="min-h-[192px] max-h-[192px] shadow rounded-t object-cover"
    />
    <div class="flex flex-col gap-3 h-full p-3">
      <NuxtLink :to="localeRoute({ path: `/tables/${table.id}` })" class="font-semibold uppercase text-accent-dark">
        {{ table.title }}</NuxtLink
      >
      <p class="text-sm font-roboto-slab whitespace-pre-line">
        {{
          needToCropDescription
            ? `${table.description.substring(0, TABLE_CARD_DESCRIPTION_LENGTH).trimEnd()}...`
            : table.description
        }}
        <NuxtLink :to="localeRoute({ path: `/tables/${table.id}` })" v-if="needToCropDescription" class="font-semibold">
          {{ $t('table-card.read-more') }}
        </NuxtLink>
      </p>
      <div class="flex flex-wrap gap-1">
        <div
          v-for="flair in table.flairs"
          class="flex items-center px-1 py-0.5 border border-accent-light shadow rounded text-xs text-primary-light"
        >
          {{ flairsStore.getFlairLabel(flair) }}
        </div>
      </div>
      <div class="flex justify-between items-center gap-2 mt-auto">
        <div class="flex items-center gap-1">
          <NuxtImg
            :src="table?.ownerHeader?.avatar ?? DEFAULT_USER_AVATAR"
            :alt="table?.ownerHeader?.username"
            width="20px"
            height="20px"
            class="shadow rounded-full"
          />
          <h1 class="text-xs font-semibold truncate">{{ table?.ownerHeader?.username }}</h1>
        </div>
        <button name="options" @click.prevent="showOptions = !showOptions" class="btn-secondary">
          <NuxtIcon name="three-dots" />
        </button>
      </div>
    </div>
    <TableCardOptions :show="showOptions" :table="table" @close="showOptions = false" />
  </div>
</template>
