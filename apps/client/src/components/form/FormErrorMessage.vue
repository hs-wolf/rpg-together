<script setup lang="ts">
defineProps<{ error: string }>()
</script>

<template>
  <Transition name="fade">
    <span v-if="error" class="relative self-end flex items-center p-2 bg-danger rounded-sm text-secondary">
      <p class="text-xs leading-none font-semibold">{{ error }}</p>
      <div class="absolute bottom-full error-message-arrow-up" />
    </span>
  </Transition>
</template>
