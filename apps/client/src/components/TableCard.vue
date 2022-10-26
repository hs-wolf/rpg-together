<script setup lang="ts">
import { useTablesStore } from '~/stores';

// TODO: Change any for the table class.
defineProps<{ table: any }>();

const tablesStore = useTablesStore();
</script>

<template>
  <div class="relative flex flex-col bg-secondary rounded text-primary break-all">
    <img
      :src="table.banner ?? ''"
      :alt="table.title"
      width="128"
      height="128"
      class="object-cover w-full h-[128px] rounded-t shadow"
    />
    <div class="flex flex-col gap-3 h-full p-3">
      <h1 class="font-semibold uppercase">{{ table.title }}</h1>
      <p class="text-sm">{{ table.summary }}</p>
      <div class="flex flex-wrap gap-1">
        <button
          v-for="flair in table.flairs"
          class="flex items-center px-1 py-0.5 bg-accent-dark shadow rounded text-xs text-secondary"
        >
          {{ flair }}
        </button>
      </div>
      <div class="flex justify-between items-center gap-2 mt-auto">
        <div class="flex items-center gap-1">
          <img
            :src="table.owner.avatar ?? ''"
            :alt="table.owner.name"
            width="20"
            height="20"
            class="w-5 h-5 shadow rounded-full"
          />
          <h1 class="text-xs font-semibold truncate">{{ table.owner.name }}</h1>
        </div>
        <button name="options" @click.prevent="tablesStore.toggleTableCardOptions(table)" class="btn-primary">
          <NuxtIcon name="three-dots" />
        </button>
      </div>
    </div>
  </div>
</template>
