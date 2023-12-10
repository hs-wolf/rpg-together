<script setup lang="ts">
import type { Table } from '@rpg-together/models'
import { DEFAULT_TABLE_BANNER } from '@rpg-together/utilities'
import { useApplicationsStore, useFlairsStore } from '~/stores'

const props = defineProps<{ table: Table }>()
defineEmits<{ (_eventName: 'delete', _table: Table): void }>()

const localePath = useLocalePath()
const flairsStore = useFlairsStore()
const applicationsStore = useApplicationsStore()

const applications = ref(await applicationsStore.getApplicationsFromTable(props.table.id))

const showInfo = ref(false)
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
      class="w-full h-32 lg:h-48 rounded-t-sm object-cover"
    />
    <NuxtLink
      :to="localePath({ path: `/my-tables/${table?.id}/applications` })"
      class="btn-primary absolute self-end m-1 gap-2 lg:gap-3"
    >
      <NuxtIcon name="message-plus" :class="applications.length ? 'text-accent ' : 'opacity-50'" />
      <p class="font-semibold" :class="applications.length ? 'text-accent ' : 'opacity-50'">
        {{ applications.length }}
      </p>
      <p>{{ $t('my-tables-table-card.applicants', applications.length) }}</p>
    </NuxtLink>
    <div class="flex flex-col gap-[1px] shadow overflow-hidden">
      <button
        class="z-10 flex justify-between items-center p-2 lg:p-3 bg-secondary"
        :class="{ 'rounded-b-sm': !showInfo }"
        @click.prevent="showInfo = !showInfo"
      >
        <i18n-t keypath="my-tables-table-card.title" tag="h1" scope="global" class="text-start">
          <template #text>
            <span class="lg:text-lg font-semibold break-all">{{ table.title }}</span>
          </template>
        </i18n-t>
        <NuxtIcon name="chevron-up" class="shrink-0 text-xl lg:text-2xl transition-transform" :class="{ 'rotate-180': showInfo }" />
      </button>
      <Transition name="slide-down">
        <div v-if="showInfo" class="card-secondary gap-5 rounded-t-none">
          <div class="flex flex-wrap justify-end gap-3 lg:gap-5 w-full">
            <NuxtLink :to="localePath({ path: `/editing-table/${table?.id}` })" class="btn-accent gap-2">
              <NuxtIcon name="edit-pencil" />
              <p>{{ $t('my-tables-table-card.edit') }}</p>
            </NuxtLink>
            <NuxtLink :to="localePath({ path: `/tables/${table?.id}` })" class="btn-secondary gap-2">
              <NuxtIcon name="eye-open" />
              <p>{{ $t('my-tables-table-card.view') }}</p>
            </NuxtLink>
          </div>
          <i18n-t keypath="my-tables-table-card.description" tag="p" scope="global" class="font-semibold leading-5">
            <template #text>
              <span class="font-normal whitespace-pre-line lg:text-lg">{{ table.description }}</span>
            </template>
          </i18n-t>
          <div v-if="table.flairs && table.flairs.length" class="flex flex-wrap items-center gap-1 lg:gap-2">
            <p class="font-semibold lg:text-lg">
              {{ $t('my-tables-table-card.flairs') }}
            </p>
            <div
              v-for="flair in table.flairs"
              :key="flair"
              class="flex items-center px-1 py-0.5 lg:px-1.5 lg:py-1 bg-accent shadow rounded-sm text-xs lg:text-sm text-secondary"
            >
              {{ flairsStore.getFlairLabel(flair) }}
            </div>
          </div>
          <button class="btn-danger self-end" @click.prevent="$emit('delete', table)">
            {{ $t('my-tables-table-card.delete') }}
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>
