<script setup lang="ts">
// TODO: Change any for the alert class.
defineProps<{ alert: any }>();
defineEmits<{ (e: 'markAsRead'): void }>();
</script>

<template>
  <button
    class="flex flex-col gap-1 p-2 border border-primary-light rounded text-start text-primary transition-transform active:scale-90"
    :class="alert.read ? 'bg-secondary-dark' : 'bg-secondary'"
    @click.prevent="$emit('markAsRead')"
  >
    <div class="flex items-center gap-1" :class="alert.read ? 'text-primary-light' : 'text-accent'">
      <Icon name="mdi:bell" />
      <h1 class="text-sm font-medium leading-none">{{ alert.title }}</h1>
    </div>
    <p class="text-xs">{{ alert.message }}</p>
  </button>
</template>
