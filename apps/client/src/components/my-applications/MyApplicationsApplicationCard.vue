<script setup lang="ts">
import { TABLE_CARD_DESCRIPTION_LENGTH } from '~/constants';
import { useTablesStore, useFlairsStore } from '~/stores';
import { Application, ApplicationStatus, Table } from '@rpg-together/models';
import { LIMIT_OF_APPLICATIONS, DEFAULT_TABLE_BANNER, DEFAULT_USER_AVATAR } from '@rpg-together/utils';

const props = defineProps<{ application: Application }>();

const localeRoute = useLocaleRoute();
const tablesStore = useTablesStore();
const flairsStore = useFlairsStore();

const table = ref<Table>();

onBeforeMount(async () => {
  table.value = await tablesStore.fetchTable(props.application.tableId);
});

const showInfo = ref(false);

const statusColor = computed(() => {
  switch (props.application.status) {
    case ApplicationStatus.WAITING:
      return 'text-blue-500';
    case ApplicationStatus.ACCEPTED:
      return 'text-green-500';
    case ApplicationStatus.DECLINED:
      return 'text-danger';
    default:
      return 'text-blue-500';
  }
});
</script>

<template>
  <div class="relative flex flex-col text-primary">
    <NuxtImg
      :src="application.tableHeader.banner ?? DEFAULT_TABLE_BANNER"
      :alt="application.tableHeader.title"
      width="auto"
      height="128px"
      class="min-h-[128px] max-h-[128px] shadow rounded-t object-cover"
    />
    <div class="flex flex-col gap-[1px] shadow overflow-hidden">
      <button
        class="z-10 flex justify-between items-center p-3 bg-secondary"
        :class="{ 'rounded-b-sm': !showInfo }"
        @click.prevent="showInfo = !showInfo"
      >
        <i18n-t keypath="my-applications-application-card.table-title" tag="h1" scope="global" class="text-start">
          <template #text>
            <span class="font-semibold">{{ application.tableHeader.title }}</span>
          </template>
        </i18n-t>
        <NuxtIcon name="chevron-up" class="shrink-0 text-xl transition-transform" :class="{ 'rotate-180': showInfo }" />
      </button>
      <Transition name="slide-down">
        <div v-if="showInfo" class="flex flex-col gap-5 h-full px-3 py-4 bg-secondary rounded-b-sm">
          <i18n-t
            keypath="my-applications-application-card.table-owner"
            tag="p"
            scope="global"
            class="flex items-center gap-1 font-semibold leading-5"
          >
            <template #text>
              <div class="flex items-center gap-1">
                <NuxtImg
                  :src="table?.ownerHeader?.avatar ?? DEFAULT_USER_AVATAR"
                  :alt="table?.ownerHeader?.username"
                  width="20px"
                  height="20px"
                  class="shadow rounded-full"
                />
                <h1 class="font-normal truncate">{{ table?.ownerHeader?.username }}</h1>
              </div>
            </template>
          </i18n-t>
          <i18n-t
            keypath="my-applications-application-card.your-message"
            tag="p"
            scope="global"
            class="flex flex-col gap-2 font-semibold leading-5"
          >
            <template #text>
              <span class="text-sm font-roboto-slab font-normal whitespace-pre-line">
                {{ application?.message }}
              </span>
            </template>
          </i18n-t>
          <i18n-t keypath="my-applications-application-card.status" tag="p" scope="global" class="font-semibold leading-5">
            <template #text>
              <span :class="statusColor">
                {{ application?.status }}
              </span>
            </template>
          </i18n-t>
          <i18n-t
            v-if="application.status === ApplicationStatus.ACCEPTED"
            keypath="my-applications-application-card.accepted-message"
            tag="p"
            scope="global"
            class="flex flex-col gap-2 font-semibold leading-5"
          >
            <template #text>
              <span class="text-sm font-roboto-slab font-normal whitespace-pre-line">
                {{ table?.acceptMessage }}
              </span>
            </template>
          </i18n-t>
          <p>{{ $t('my-applications-application-card.declined-message') }}</p>
        </div>
      </Transition>
    </div>
  </div>
</template>
