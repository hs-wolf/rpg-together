<script setup lang="ts">
import { Notification } from '@rpg-together/models';

defineProps<{ notification: Notification }>();

defineEmits<{ (e: 'markAsRead'): void }>();
</script>

<template>
  <button
    class="flex flex-col gap-1 p-2 border border-primary-light rounded text-start text-primary transition-transform active:scale-90"
    :class="notification.read ? 'bg-secondary-dark' : 'bg-secondary'"
    @click.prevent="$emit('markAsRead')"
  >
    <div class="flex items-center gap-1" :class="notification.read ? 'text-primary-light' : 'text-accent'">
      <NuxtIcon name="bell" />
      <h1 class="text-sm font-medium leading-none">{{ notification.title }}</h1>
    </div>
    <p class="text-xs">{{ notification.message }}</p>
  </button>
</template>
