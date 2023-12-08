<script setup lang="ts">
const routesToHide = ['search']

const hideFooter = computed(() => {
  return routesToHide.some(route => useRoute().name?.toString().toLowerCase().includes(route))
})
</script>

<template>
  <div class="flex flex-col mt-auto py-5 lg:py-10" :class="{ hidden: hideFooter }">
    <h1 class="text-center text-xs lg:text-sm">
      <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" class="text-accent">CC BY-NC-SA 4.0</a> 2023 © José Israel
    </h1>
  </div>
</template>
