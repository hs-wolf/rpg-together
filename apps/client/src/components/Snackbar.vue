<script setup lang="ts">
import { SnackType } from '~/types'
import { useSnackbarStore } from '~/stores'

const snackbarStore = useSnackbarStore()
const { currentSnack, waitingSnack } = storeToRefs(snackbarStore)

const currentBgAndIcon = computed(() => {
  switch (currentSnack.value.type) {
    case SnackType.SUCCESS:
      return { bg: 'bg-green-500', icon: 'check' }
    case SnackType.WARNING:
      return { bg: 'bg-yellow-500', icon: 'alert' }
    case SnackType.ERROR:
      return { bg: 'bg-danger', icon: 'danger' }
    default:
      return { bg: 'bg-yellow-500', icon: 'alert' }
  }
})
</script>

<template>
  <Transition name="slide-down">
    <div class="z-50 fixed inset-x-3 top-3 flex flex-col lg:left-auto">
      <button
        v-if="waitingSnack"
        name="clear-snack"
        class="flex items-center gap-2 p-3 shadow rounded"
        :class="[currentBgAndIcon.bg]"
        @click.prevent="snackbarStore.clearCurrentSnack"
      >
        <NuxtIcon :name="currentBgAndIcon.icon" class="text-xl" />
        <p class="w-full font-medium break-all">
          {{ currentSnack.message }}
        </p>
        <NuxtIcon name="x-close-circle" class="text-lg" />
      </button>
    </div>
  </Transition>
</template>
