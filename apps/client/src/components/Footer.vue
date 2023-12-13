<script setup lang="ts">
const routesToHide = ['search']

const hideFooter = computed(() => {
  return routesToHide.some(route => useRoute().name?.toString().toLowerCase().includes(route))
})
</script>

<template>
  <div class="flex flex-col mt-auto py-9 lg:py-[4.5rem]" :class="{ hidden: hideFooter }">
    <h1 class="text-center text-xs lg:text-sm text-secondary-2">
      <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" class="text-accent-2">CC BY-NC-SA 4.0</a> 2023 © José Israel
    </h1>
  </div>
</template>
