<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AdvancedSelectOption } from '~/types';
import { useNotificationsStore } from '~/stores';

definePageMeta({ middleware: ['logged-in'] });

useHead({ title: useI18n().t('notifications.title') });

const notificationsStore = useNotificationsStore();
const { unreadNotificationsNumber } = storeToRefs(notificationsStore);

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
  findAlert.read = await notificationsStore.markAsRead(id);
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
  alerts.value = notificationsStore.getNotifications();
});
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="$t('notifications.title')" />
    <div class="flex flex-col gap-3 p-3">
      <button class="btn-primary gap-2" @click.prevent="markAllAsRead">
        <p>Mark all as read</p>
        <NuxtIcon name="check" />
      </button>
      <h1 class="p-3 text-center">
        You have <strong>{{ unreadNotificationsNumber }}</strong> unread alerts.
      </h1>
    </div>
    <div class="px-3">
      <AdvancedSelect
        ref="systemsFilterRef"
        :options="alertTypesList"
        placeholderMessage="Alert types"
        searchMessage="Search"
        emptyMessage="No options left."
        :enableSearch="false"
        @change-options="(options) => (selectedAlertTypes = options)"
      />
    </div>
    <div class="flex flex-col p-3">
      <div v-if="filteredAlerts?.length" class="flex flex-col gap-1">
        <AlertsAlertCard v-for="alert in filteredAlerts" :key="alert.id" :alert="alert" @markAsRead="markAsRead(alert.id)" />
        <button class="btn-accent mt-2">Load more</button>
      </div>
      <LoadingCard v-else />
    </div>
  </div>
</template>
