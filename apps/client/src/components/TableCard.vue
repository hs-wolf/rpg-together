<script setup lang="ts">
import { useTablesStore, useFlairsStore } from '~/stores';
import { Table, TableCreateBody, TableUpdateBody } from '@rpg-together/models';
import { DEFAULT_USER_AVATAR, DEFAULT_TABLE_BANNER } from '@rpg-together/utils';

// TODO: Change any for the table class.
defineProps<{ table: Table }>();

const tablesStore = useTablesStore();
const flairsStore = useFlairsStore();
</script>

<template>
  <div class="relative flex flex-col bg-secondary rounded text-primary break-all">
    <NuxtImg
      :src="table?.banner ?? DEFAULT_TABLE_BANNER"
      :alt="table?.title"
      width="128"
      height="128"
      sizes="sm:100vw md:50vw lg:400px"
      format="webp"
      class="w-full shadow rounded-t object-cover"
    />
    <div class="flex flex-col gap-3 h-full p-3">
      <h1 class="font-semibold uppercase">{{ table.title }}</h1>
      <p class="text-sm">{{ table.description }}</p>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="flair in table.flairs"
          class="flex items-center px-1 py-0.5 bg-accent-dark shadow rounded text-xs text-secondary"
        >
          {{ flairsStore.getFlairLabel(flair) }}
        </button>
      </div>
      <div class="flex justify-between items-center gap-2 mt-auto">
        <div class="flex items-center gap-1">
          <NuxtImg
            :src="table?.ownerHeader?.avatar ?? DEFAULT_USER_AVATAR"
            :alt="table?.ownerHeader?.username"
            width="20"
            height="20"
            sizes="sm:100vw md:50vw lg:400px"
            format="webp"
            class="shadow rounded-full"
          />
          <h1 class="text-xs font-semibold truncate">{{ table?.ownerHeader?.username }}</h1>
        </div>
        <button name="options" @click.prevent="tablesStore.toggleTableCardOptions(table)" class="btn-primary">
          <NuxtIcon name="three-dots" />
        </button>
      </div>
    </div>
  </div>
</template>
