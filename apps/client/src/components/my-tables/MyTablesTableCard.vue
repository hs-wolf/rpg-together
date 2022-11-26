<script setup lang="ts">
import { useTablesStore } from '~/stores';
import { Table } from '@rpg-together/models';
import { DEFAULT_USER_AVATAR, DEFAULT_TABLE_BANNER } from '@rpg-together/utils';

defineProps<{ table: Table }>();

const tablesStore = useTablesStore();

const showInfo = ref(false);
</script>

<template>
  <div class="relative flex flex-col text-primary break-all">
    <NuxtImg
      :src="table?.banner ?? DEFAULT_TABLE_BANNER"
      :alt="table?.title"
      width="128"
      height="128"
      sizes="sm:100vw md:50vw lg:400px"
      format="webp"
      class="w-full h-32 shadow rounded-t object-cover"
    />
    <div class="flex flex-col gap-1 overflow-hidden">
      <button
        class="z-10 flex justify-between items-center p-3 bg-secondary"
        :class="{ 'rounded-b': !showInfo }"
        @click.prevent="showInfo = !showInfo"
      >
        <h1 class="text-sm"><span class="font-semibold">Title: </span>{{ table.title }}</h1>
        <Icon name="ion:chevron-up" class="text-xl transition-transform" :class="{ 'rotate-180': showInfo }" />
      </button>
      <Transition name="slide-down">
        <div v-if="showInfo" class="flex flex-col gap-3 h-full p-3 bg-secondary rounded-b">
          <div class="flex justify-end gap-3 w-full">
            <button class="btn-accent gap-2">
              <Icon name="material-symbols:edit" />
              <p>Edit</p>
            </button>
            <button class="btn-secondary gap-2">
              <Icon name="ic:baseline-remove-red-eye" />
              <p>View</p>
            </button>
          </div>
          <p class="text-sm"><span class="font-semibold">Description: </span>{{ table.description }}</p>
          <div class="flex flex-wrap gap-1 text-sm">
            <p class="px-1 font-semibold">Flairs:</p>
            <div
              v-for="flair in table.flairs"
              class="flex items-center px-1.5 py-0.5 bg-accent-dark shadow rounded text-secondary"
            >
              {{ flair }}
            </div>
          </div>
          <button class="btn-danger self-end">Delete</button>
        </div>
      </Transition>
    </div>
  </div>
</template>
