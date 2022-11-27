<script setup lang="ts">
defineProps<{ title: string; back?: string }>();
</script>

<template>
  <div
    class="flex items-center gap-2 h-24 p-3 text-xl tracking-widest font-semibold"
    :class="back ? 'justify-between' : 'justify-center'"
  >
    <NuxtLink v-if="back" :to="{ name: back }">
      <Icon name="material-symbols:arrow-back-ios-new-rounded" class="text-2xl" />
    </NuxtLink>
    <div class="flex items-center gap-2">
      <p class="text-2xl text-accent font-righteous">{{ title }}</p>
    </div>
  </div>
</template>
