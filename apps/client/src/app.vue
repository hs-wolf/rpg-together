<script setup lang="ts">
import { useLocalesStore } from '~/stores';

const localesStore = useLocalesStore();
const { direction } = storeToRefs(localesStore);
</script>

<template>
  <div :dir="direction" class="flex flex-col min-h-screen">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Snackbar />
  </div>
</template>
