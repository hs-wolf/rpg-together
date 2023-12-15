<script setup lang="ts">
const emits = defineEmits<{ (_e: 'close'): void; (_e: 'confirm'): void }>()

const cardRef = ref<HTMLElement>()
onClickOutside(cardRef, () => {
  emits('close')
})

function confirm() {
  emits('confirm')
  emits('close')
}
</script>

<template>
  <div class="modal justify-center">
    <div ref="cardRef" class="card-secondary gap-2 lg:gap-3 w-full lg:max-w-xl lg:mx-auto">
      <h1 class="text-danger font-semibold">
        {{ $t('components.discard-changes-dialog.title') }}
      </h1>
      <p class="text-sm lg:text-base">
        {{ $t('components.discard-changes-dialog.message') }}
      </p>
      <div class="grid grid-cols-2 gap-2 lg:gap-3 mt-2 lg:mt-3">
        <button class="btn btn-primary" @click.prevent="emits('close')">
          {{ $t('components.discard-changes-dialog.close') }}
        </button>
        <button class="btn btn-secondary" @click.prevent="confirm">
          {{ $t('components.discard-changes-dialog.confirm') }}
        </button>
      </div>
    </div>
  </div>
</template>
