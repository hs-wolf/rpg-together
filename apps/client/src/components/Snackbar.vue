<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { SnackType } from '~~/custom-types';
import { useSnackbarStore } from '~/stores';

const snackbarStore = useSnackbarStore();
const { currentSnack, waitingSnack } = storeToRefs(snackbarStore);

const currentBgAndIcon = computed(() => {
  switch (currentSnack.value.type) {
    case SnackType.SUCCESS:
      return { bg: 'bg-green-500', icon: 'success' };
    case SnackType.WARNING:
      return { bg: 'bg-yellow-500', icon: 'alert' };
    case SnackType.ERROR:
      return { bg: 'bg-red-500', icon: 'error' };
    default:
      return { bg: 'bg-yellow-500', icon: 'warning' };
  }
});
</script>

<template>
  <transition name="snackbar-slide">
    <div
      v-if="waitingSnack"
      class="fixed inset-x-3 top-3 flex items-center gap-2 p-3 shadow rounded"
      :class="[currentBgAndIcon.bg]"
    >
      <NuxtIcon :name="currentBgAndIcon.icon" class="text-xl" />
      <p class="font-medium">{{ currentSnack.message }}</p>
    </div>
  </transition>
</template>

<style scoped>
.snackbar-slide-enter-active,
.snackbar-slide-leave-active {
  transition: all 0.15s ease-out;
}
.snackbar-slide-enter-from,
.snackbar-slide-leave-to {
  transform: translateY(-100%);
}
</style>
