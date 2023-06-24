<script setup lang="ts">
import { useTablesStore } from '~/stores';
import { Application, ApplicationStatus, Table } from '@rpg-together/models';
import { DEFAULT_USER_AVATAR } from '@rpg-together/utils';

const props = defineProps<{ application: Application }>();

const emits = defineEmits<{ (e: 'accept'): void; (e: 'decline'): void }>();

const localeRoute = useLocaleRoute();
const tablesStore = useTablesStore();

const table = ref<Table>();

onBeforeMount(async () => {
  table.value = await tablesStore.getTable(props.application.tableId);
});

const showInfo = ref(false);
const showAcceptModal = ref(false);
const showRejectModal = ref(false);

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

const acceptApplication = () => {
  showAcceptModal.value = false;
  emits('accept');
};

const declineApplication = () => {
  showRejectModal.value = false;
  emits('accept');
};
</script>

<template>
  <div class="flex flex-col gap-[1px] shadow text-primary overflow-hidden">
    <button
      class="z-10 flex justify-between items-center gap-2 p-3 bg-secondary rounded-sm"
      :class="showInfo ? 'rounded-t-sm' : 'rounded-sm'"
      @click.prevent="showInfo = !showInfo"
    >
      <div class="flex items-center gap-2 text-start">
        <NuxtIcon :name="statusIcon" class="text-xl" :class="statusColor" />
        <NuxtImg
          :src="application?.applicantHeader?.avatar ?? DEFAULT_USER_AVATAR"
          :alt="application?.applicantHeader?.username"
          width="20px"
          height="20px"
          class="shadow rounded-full"
        />
        <h1 class="truncate font-semibold">{{ application?.applicantHeader?.username }}</h1>
      </div>
      <NuxtIcon name="chevron-up" class="shrink-0 text-xl transition-transform" :class="{ 'rotate-180': !showInfo }" />
    </button>
    <Transition name="slide-down">
      <div v-if="showInfo" class="card-secondary gap-5 rounded-t-none">
        <i18n-t
          keypath="my-tables-application-card.their-message"
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
        <div class="flex flex-wrap justify-end gap-3">
          <button
            v-if="application.status === ApplicationStatus.WAITING"
            @click.prevent="showRejectModal = !showRejectModal"
            class="btn-danger"
          >
            {{ $t('my-tables-application-card.decline') }}
          </button>
          <NuxtLink :to="localeRoute({ path: `/profile/${application?.applicantId}` })" class="btn-secondary flex gap-2">
            <NuxtIcon name="external-link" />
            <p>{{ $t('my-tables-application-card.profile') }}</p>
          </NuxtLink>
          <button
            v-if="application.status === ApplicationStatus.WAITING"
            @click.prevent="showAcceptModal = !showAcceptModal"
            class="btn-accent"
          >
            {{ $t('my-tables-application-card.accept') }}
          </button>
        </div>
      </div>
    </Transition>
    <MyTablesApplicationCardAcceptModal
      :show="showAcceptModal"
      :application="application"
      @close="showAcceptModal = false"
      @accept="acceptApplication"
    />
    <MyTablesApplicationCardDeclineModal
      :show="showRejectModal"
      :application="application"
      @close="showRejectModal = false"
      @decline="declineApplication"
    />
  </div>
</template>
