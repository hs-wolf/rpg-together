<script setup lang="ts">
import { useTablesStore } from '~/stores';
import { Application, ApplicationStatus, Table } from '@rpg-together/models';
import { DEFAULT_TABLE_BANNER, DEFAULT_USER_AVATAR } from '@rpg-together/utils';

const props = defineProps<{ application: Application }>();

const localeRoute = useLocaleRoute();
const tablesStore = useTablesStore();

const table = ref<Table>();

onBeforeMount(async () => {
  table.value = await tablesStore.getTable(props.application.tableId);
});

const showInfo = ref(false);
const showDeleteModal = ref(false);

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

const statusIcon = computed(() => {
  switch (props.application.status) {
    case ApplicationStatus.WAITING:
      return 'analog-clock';
    case ApplicationStatus.ACCEPTED:
      return 'check';
    case ApplicationStatus.DECLINED:
      return 'danger';
    default:
      return 'analog-clock';
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
    <div class="absolute top-2 inset-x-2 flex justify-end gap-2">
      <NuxtLink :to="localeRoute({ path: `/profile/${table?.ownerId}` })" class="btn-primary gap-2 overflow-hidden">
        <NuxtImg
          :src="table?.ownerHeader?.avatar ?? DEFAULT_USER_AVATAR"
          :alt="table?.ownerHeader?.username"
          width="20px"
          height="20px"
          class="shadow rounded-full"
        />
        <h1 class="truncate">{{ table?.ownerHeader?.username }}</h1>
      </NuxtLink>
      <NuxtLink :to="localeRoute({ path: `/tables/${table?.id}` })" class="btn-secondary gap-2">
        <NuxtIcon name="bar-table" class="text-xl" />
        <p>{{ $t('my-applications-application-card.view-table') }}</p>
      </NuxtLink>
    </div>
    <div class="flex flex-col gap-[1px] shadow overflow-hidden">
      <button
        class="z-10 flex justify-between items-center gap-2 p-3 bg-secondary"
        :class="{ 'rounded-b-sm': !showInfo }"
        @click.prevent="showInfo = !showInfo"
      >
        <div class="flex items-center gap-2 text-start">
          <NuxtIcon :name="statusIcon" class="text-xl" :class="statusColor" />
          <i18n-t keypath="my-applications-application-card.applying-to" tag="span" scope="global" class="text-sm">
            <template #text>
              <span class="text-base font-semibold break-all">{{ application.tableHeader.title }}</span>
            </template>
          </i18n-t>
        </div>
        <NuxtIcon name="chevron-up" class="shrink-0 text-xl transition-transform" :class="{ 'rotate-180': showInfo }" />
      </button>
      <Transition name="slide-down">
        <div v-if="showInfo" class="card-secondary gap-5 rounded-t-none">
          <i18n-t
            keypath="my-applications-application-card.your-message"
            tag="p"
            scope="global"
            class="flex flex-col gap-1 text-sm font-semibold"
          >
            <template #text>
              <span class="text-base font-normal font-roboto-slab leading-5 whitespace-pre-line">
                {{ application?.message }}
              </span>
            </template>
          </i18n-t>
          <hr class="border-secondary-dark" />
          <i18n-t keypath="my-applications-application-card.status" tag="p" scope="global" class="text-sm font-semibold">
            <template #text>
              <span class="text-base" :class="statusColor">
                {{ application?.status }}
              </span>
            </template>
          </i18n-t>
          <i18n-t
            v-if="application.status === ApplicationStatus.ACCEPTED"
            keypath="my-applications-application-card.owner-message"
            tag="p"
            scope="global"
            class="flex flex-col gap-1 text-sm font-semibold"
          >
            <template #text>
              <span class="text-base font-roboto-slab font-normal leading-5 whitespace-pre-line">
                {{ table?.acceptMessage }}
              </span>
            </template>
          </i18n-t>
          <p v-if="application.status === ApplicationStatus.DECLINED" class="text-sm">
            {{ $t('my-applications-application-card.declined-message') }}
          </p>
          <div class="flex justify-end">
            <button @click.prevent="showDeleteModal = !showDeleteModal" class="btn-danger">
              <NuxtIcon name="trash" class="text-lg" />
            </button>
          </div>
        </div>
      </Transition>
    </div>
    <MyApplicationsDeleteApplicationModal :show="showDeleteModal" :application="application" @close="showDeleteModal = false" />
  </div>
</template>
