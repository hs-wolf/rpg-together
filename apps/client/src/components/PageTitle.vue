<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div class="flex justify-center items-center gap-2 h-24 p-3 pb-0 text-xl tracking-widest font-semibold">
    <Icon name="Logo" class="text-2xl" />
    <p class="text-accent">{{ title }}</p>
  </div>
</template>
