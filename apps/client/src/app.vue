<script setup lang="ts">
import { useLocalesStore } from '~/stores';

const localesStore = useLocalesStore();
const { direction } = storeToRefs(localesStore);
</script>

<template>
  <div :dir="direction" class="fixed inset-0 flex flex-col">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Snackbar />
  </div>
</template>
