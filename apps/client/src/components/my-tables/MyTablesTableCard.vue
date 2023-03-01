<script setup lang="ts">
import { useTablesStore, useFlairsStore } from '~/stores';
import { Table } from '@rpg-together/models';
import { DEFAULT_TABLE_BANNER } from '@rpg-together/utils';

defineProps<{ table: Table }>();
defineEmits<{ (eventName: 'delete', table: Table): void }>();

const tablesStore = useTablesStore();
const flairsStore = useFlairsStore();

const showInfo = ref(false);
</script>

<template>
  <div class="relative flex flex-col text-primary">
    <NuxtImg
      :src="table?.banner ?? DEFAULT_TABLE_BANNER"
      :alt="table?.title"
      width="128"
      height="128"
      sizes="sm:100vw md:50vw lg:400px"
      format="webp"
      class="w-full h-32 rounded-t-sm object-cover"
    />
    <button class="btn-primary absolute self-end m-1 gap-2">
      <NuxtIcon name="message-plus" />
      <p>{{ $t('my-tables-table-card.applicants') }}</p>
    </button>
    <div class="flex flex-col gap-[1px] shadow overflow-hidden">
      <button
        class="z-10 flex justify-between items-center p-3 bg-secondary"
        :class="{ 'rounded-b-sm': !showInfo }"
        @click.prevent="showInfo = !showInfo"
      >
        <i18n-t keypath="my-tables-table-card.title" tag="h1" scope="global" class="text-start">
          <template #text>
            <span class="font-semibold">{{ table.title }}</span>
          </template>
        </i18n-t>
        <NuxtIcon name="chevron-up" class="shrink-0 text-xl transition-transform" :class="{ 'rotate-180': showInfo }" />
      </button>
      <Transition name="slide-down">
        <div v-if="showInfo" class="flex flex-col gap-5 h-full p-3 bg-secondary rounded-b-sm">
          <div class="flex flex-wrap justify-end gap-3 w-full">
            <NuxtLink :to="{ path: `/editing-table/${table?.id}` }" class="btn-accent gap-2">
              <NuxtIcon name="edit-pencil" />
              <p>{{ $t('my-tables-table-card.edit') }}</p>
            </NuxtLink>
            <NuxtLink :to="{ path: `/tables/${table?.id}` }" class="btn-secondary gap-2">
              <NuxtIcon name="eye-open" />
              <p>{{ $t('my-tables-table-card.view') }}</p>
            </NuxtLink>
          </div>
          <i18n-t keypath="my-tables-table-card.description" tag="p" scope="global" class="font-semibold leading-5">
            <template #text>
              <span class="font-normal whitespace-pre-line">{{ table.description }}</span>
            </template>
          </i18n-t>
          <div v-if="table.flairs && table.flairs.length" class="flex flex-wrap items-center gap-1">
            <p class="font-semibold">{{ $t('my-tables-table-card.flairs') }}</p>
            <div
              v-for="flair in table.flairs"
              class="flex items-center px-1.5 py-1 bg-accent shadow rounded-sm text-sm text-secondary"
            >
              {{ flairsStore.getFlairLabel(flair) }}
            </div>
          </div>
          <button @click.prevent="$emit('delete', table)" class="btn-danger self-end">
            {{ $t('my-tables-table-card.delete') }}
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>
