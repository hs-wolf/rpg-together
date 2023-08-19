<script setup lang="ts">
import { Notification, NotificationContent } from '@rpg-together/models';

const props = defineProps<{ notification: Notification }>();

const emits = defineEmits<{ (e: 'markAsRead'): void }>();

const localeRoute = useLocaleRoute();

const onClick = () => {
  emits('markAsRead');
  switch (props.notification.content) {
    case NotificationContent.APPLIED_TO_YOUR_TABLE:
      return navigateTo(localeRoute({ path: `/my-tables/${props.notification.data.yourTableId}/applications` }));
  }
};
</script>

<template>
  <button
    class="flex flex-col gap-1 p-2 border border-primary-light rounded text-start text-primary transition-transform active:scale-90"
    :class="notification.read ? 'bg-secondary-dark' : 'bg-secondary'"
    @click.prevent="onClick"
  >
    <div class="flex items-center gap-1" :class="notification.read ? 'text-primary-light' : 'text-accent'">
      <NuxtIcon name="bell" />
      <h1 class="text-sm font-medium leading-none">{{ $t(`notification-titles.${notification.content}`) }}</h1>
    </div>
    <i18n-t
      :keypath="`notification-messages.${NotificationContent.APPLIED_TO_YOUR_TABLE}`"
      tag="p"
      scope="global"
      class="text-xs"
    >
      <template #name>
        <span class="font-semibold">{{ notification.data.yourTableApplicantId }}</span>
      </template>
      <template #table>
        <span class="font-semibold">{{ notification.data.yourTableId }}</span>
      </template>
    </i18n-t>
  </button>
</template>
