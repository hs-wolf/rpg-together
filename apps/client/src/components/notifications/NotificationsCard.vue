<script setup lang="ts">
import type { Application, Notification } from '@rpg-together/models'
import { NotificationContent } from '@rpg-together/models'

const props = defineProps<{ notification: Notification }>()

const emits = defineEmits<{ (_e: 'markAsRead'): void }>()

const localeRoute = useLocaleRoute()

const resolveNotificationData = computed(() => {
  switch (props.notification.content) {
    case NotificationContent.APPLIED_TO_YOUR_TABLE:
      return props.notification.data as Application
    case NotificationContent.APPLICATION_ACCEPTED:
      return props.notification.data as Application
    case NotificationContent.APPLICATION_DECLINED:
      return props.notification.data as Application
  }
})

function onClick() {
  emits('markAsRead')
  switch (props.notification.content) {
    case NotificationContent.APPLIED_TO_YOUR_TABLE:
      return navigateTo(localeRoute({ path: `/my-tables/${resolveNotificationData.value.table.id}/applications` }))
    case NotificationContent.APPLICATION_ACCEPTED:
      return navigateTo(localeRoute({ path: '/my-applications' }))
    case NotificationContent.APPLICATION_DECLINED:
      return navigateTo(localeRoute({ path: '/my-applications' }))
  }
}
</script>

<template>
  <button
    class="flex flex-col gap-0.5 p-2 lg:gap-1 lg:p-3 border border-primary-light rounded-sm text-start text-primary transition-transform active:scale-95"
    :class="notification.read ? 'bg-secondary-dark' : 'bg-secondary'"
    @click.prevent="onClick"
  >
    <div class="flex items-center gap-1" :class="notification.read ? 'text-primary-light' : 'text-accent'">
      <NuxtIcon name="bell" />
      <h1 class="text-sm font-medium lg:text-base">
        {{ $t(`notification-titles.${notification.content}`) }}
      </h1>
    </div>
    <i18n-t
      :keypath="`notification-messages.${notification.content}`"
      tag="p"
      scope="global"
      class="text-xs lg:text-sm"
    >
      <template #name>
        <span class="font-semibold">{{ resolveNotificationData.applicant.username }}</span>
      </template>
      <template #table>
        <span class="font-semibold">{{ resolveNotificationData.table.title }}</span>
      </template>
    </i18n-t>
  </button>
</template>
