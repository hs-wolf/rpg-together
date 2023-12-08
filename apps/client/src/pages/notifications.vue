<script setup lang="ts">
import { NotificationType } from '@rpg-together/models'
import type { AdvancedSelectOption } from '~/types'
import { useNotificationsStore } from '~/stores'

const { t } = useNuxtApp().$i18n

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
  <div class="flex flex-col gap-5 lg:gap-7">
    <PageTitle :title="$t('pages.notifications.title')" />
    <div class="flex flex-col gap-3 w-full px-3 lg:grid lg:grid-cols-2 lg:px-0 lg:gap-5 lg:max-w-5xl lg:mx-auto">
      <div class="flex flex-col gap-3 lg:gap-5">
        <button class="btn-primary gap-2" @click.prevent="notificationsStore.readAllNotifications">
          <p>{{ $t('pages.notifications.mark-all-read') }}</p>
          <NuxtIcon name="check" class="lg:text-lg" />
        </button>
        <i18n-t keypath="pages.notifications.unreads" tag="p" scope="global" class="py-3 text-center text-sm lg:text-base">
          <template #number>
            <span class="font-semibold">{{ unreadNotifications }}</span>
          </template>
        </i18n-t>
      </div>
      <div class="flex flex-col gap-3 lg:gap-5">
        <AdvancedSelect
          v-if="notifications.length"
          :options="notificationTypes"
          :placeholder-message="$t('pages.notifications.notification-types')"
          :search-message="$t('pages.notifications.serch-type')"
          :empty-message="$t('pages.notifications.no-types-left')"
          :enable-search="false"
          @change-options="selectNotificationTypes"
        />
        <div v-if="!firstSearch || filteredNotifications.length" class="flex flex-col">
          <LoadingCard v-if="!firstSearch" />
          <div v-else-if="filteredNotifications.length" class="flex flex-col gap-2">
            <NotificationsCard
              v-for="notification in filteredNotifications"
              :key="notification.id"
              :notification="notification"
              @mark-as-read="notificationsStore.readNotification(notification.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
