<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { SnackType } from '~~/custom-types';
import { useSnackbarStore } from '~/stores';

const snackbarStore = useSnackbarStore();
const { currentSnack, waitingSnack } = storeToRefs(snackbarStore);

const currentBgAndIcon = computed(() => {
  switch (currentSnack.value.type) {
    case SnackType.SUCCESS:
      return { bg: 'bg-green-500', icon: 'material-symbols:check-circle-rounded' };
    case SnackType.WARNING:
      return { bg: 'bg-yellow-500', icon: 'mdi:alert' };
    case SnackType.ERROR:
      return { bg: 'bg-red-500', icon: 'mdi:alert-circle' };
    default:
      return { bg: 'bg-yellow-500', icon: 'mdi:alert' };
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
      <Icon :name="currentBgAndIcon.icon" class="text-xl" />
      <p class="w-full font-medium break-all">{{ currentSnack.message }}</p>
      <button name="clear-snack" @click.prevent="snackbarStore.clearCurrentSnack">
        <Icon name="mdi:close-circle" class="text-lg" />
      </button>
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
