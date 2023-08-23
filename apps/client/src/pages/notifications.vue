<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NotificationType } from '@rpg-together/models'
import type { AdvancedSelectOption } from '~/types'
import { useNotificationsStore } from '~/stores'

const { t } = useI18n()

definePageMeta({ middleware: ['logged-in'] })

useHead({ title: t('pages.notifications.title') })

const notificationsStore = useNotificationsStore()
const { notifications, firstSearch, unreadNotifications } = storeToRefs(notificationsStore)

const notificationTypes: AdvancedSelectOption[] = Object.values(NotificationType).map(notificationType => ({
  name: notificationType,
  label: t(`notification-type.${notificationType}`),
}))

const selectedNotificationTypes = ref<AdvancedSelectOption[]>([])

const filteredNotifications = computed(() => {
  const filtersGroups = selectedNotificationTypes.value.map(notificationType => notificationType.name)
  return filtersGroups.length ? notifications.value.filter(alert => filtersGroups.includes(alert.type)) : notifications.value
})

function selectNotificationTypes(options: AdvancedSelectOption[]) {
  selectedNotificationTypes.value = options
}
</script>

<template>
  <div class="flex flex-col h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('pages.notifications.title')" />
    <div class="flex flex-col gap-3 p-3">
      <button class="btn-primary gap-2" @click.prevent="notificationsStore.readAllNotifications">
        <p>{{ $t('pages.notifications.mark-all-read') }}</p>
        <NuxtIcon name="check" />
      </button>
      <i18n-t keypath="pages.notifications.unreads" tag="h1" scope="global" class="p-3 text-center">
        <template #number>
          <span class="font-semibold">{{ unreadNotifications }}</span>
        </template>
      </i18n-t>
    </div>
    <div v-if="notifications.length" class="px-3">
      <AdvancedSelect
        :options="notificationTypes"
        :placeholder-message="$t('pages.notifications.notification-types')"
        :search-message="$t('pages.notifications.serch-type')"
        :empty-message="$t('pages.notifications.no-types-left')"
        :enable-search="false"
        @change-options="selectNotificationTypes"
      />
    </div>
    <div v-if="!firstSearch || filteredNotifications.length" class="flex flex-col p-3">
      <LoadingCard v-if="!firstSearch" />
      <div v-else-if="filteredNotifications.length" class="flex flex-col gap-1">
        <NotificationsCard
          v-for="notification in filteredNotifications"
          :key="notification.id"
          :notification="notification"
          @mark-as-read="notificationsStore.readNotification(notification.id)"
        />
        <button class="btn-accent mt-2">
          {{ $t('pages.notifications.load-more') }}
        </button>
      </div>
    </div>
  </div>
</template>
