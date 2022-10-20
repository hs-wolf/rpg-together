<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AdvancedSelectOption } from '~~/types';
import { useAlertsStore } from '~/stores';
import { storeToRefs } from 'pinia';

useHead({ title: useI18n().t('alerts.title') });

const alertsStore = useAlertsStore();
const { unreadAlertsNumber } = storeToRefs(alertsStore);

const alertTypesList = [
  { name: 'application', label: 'Applications' },
  { name: 'report', label: 'Reports' },
  { name: 'system', label: 'System' },
];

const selectedAlertTypes = ref<AdvancedSelectOption[]>([]);

const markAsRead = async (id: string) => {
  const findAlert = alerts.value?.find((alert) => alert.id === id);
  if (!findAlert || findAlert.read) {
    return;
  }
  findAlert.read = await alertsStore.markAsRead(id);
};

const markAllAsRead = async () => {
  if (!alerts.value?.length) {
    return;
  }
  await Promise.all(alerts.value.map(async (alert) => await markAsRead(alert.id)));
};

const filteredAlerts = computed(() => {
  const filtersGroups = selectedAlertTypes.value.map((alertType) => alertType.name);
  return filtersGroups.length ? alerts.value?.filter((alert) => filtersGroups.includes(alert.type)) : alerts.value;
});

// TODO: Change any for the alert cylass.
const alerts = ref<any[]>();
onMounted(() => {
  alerts.value = alertsStore.getAlerts();
});
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-center items-center gap-2 h-24 p-3 pb-0 text-xl text-accent tracking-widest font-semibold">
      <nuxt-icon name="logo" />
      <p>{{ $t('alerts.title') }}</p>
    </div>

    <button class="btn-primary gap-2 mx-3" @click.prevent="markAllAsRead">
      <p>Mark all as read</p>
      <nuxt-icon name="check" />
    </button>
    <h1 class="p-3 text-center">
      You have <strong>{{ unreadAlertsNumber }}</strong> unread alerts.
    </h1>
    <div class="px-3">
      <advanced-select
        ref="systemsFilterRef"
        :options="alertTypesList"
        placeholderMessage="Alert types"
        searchMessage="Search"
        emptyMessage="No options left."
        :enableSearch="false"
        @changeOptions="(options) => (selectedAlertTypes = options)"
      />
    </div>
    <div class="flex flex-col p-3">
      <div v-if="filteredAlerts?.length" class="flex flex-col gap-1">
        <alerts-alert-card v-for="alert in filteredAlerts" :key="alert.id" :alert="alert" @markAsRead="markAsRead(alert.id)" />
        <button class="btn-accent mt-2">Load more</button>
      </div>
      <loading-card v-else />
    </div>
  </div>
</template>
