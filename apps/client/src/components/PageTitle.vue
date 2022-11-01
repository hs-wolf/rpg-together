<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div class="flex justify-center items-center gap-2 h-24 p-3 pb-0 text-xl tracking-widest font-semibold">
    <NuxtIcon name="logo" class="text-2xl" />
    <p class="text-accent">{{ title }}</p>
  </div>
</template>
