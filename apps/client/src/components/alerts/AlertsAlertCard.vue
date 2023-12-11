<script setup lang="ts">
// TODO: Change any for the alert class.
defineProps<{ alert: any }>()
defineEmits<{ (_e: 'markAsRead'): void }>()
</script>

<template>
  <button
    class="flex flex-col gap-1 p-2 border border-primary-1 rounded text-start text-primary transition-transform active:scale-90"
    :class="alert.read ? 'bg-secondary-2' : 'bg-secondary'"
    @click.prevent="$emit('markAsRead')"
  >
    <div class="flex items-center gap-1" :class="alert.read ? 'text-primary-1' : 'text-accent'">
      <NuxtIcon name="bell" />
      <h1 class="text-sm font-semibold leading-none">
        {{ alert.title }}
      </h1>
    </div>
    <p class="text-xs">
      {{ alert.message }}
    </p>
  </button>
</template>
