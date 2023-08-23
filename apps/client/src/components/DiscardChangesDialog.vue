<script setup lang="ts">
defineProps<{ show?: boolean }>()
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
  <Transition name="fade">
    <div v-if="show" class="modal justify-center p-3">
      <div ref="cardRef" class="card-primary gap-3">
        <h1 class="text-danger font-semibold">
          {{ $t('discard-changes-dialog.title') }}
        </h1>
        <p class="text-sm">
          {{ $t('discard-changes-dialog.message') }}
        </p>
        <div class="grid grid-cols-2 gap-3 mt-3">
          <button class="btn-accent" @click.prevent="emits('close')">
            {{ $t('discard-changes-dialog.close') }}
          </button>
          <button class="btn-primary" @click.prevent="confirm">
            {{ $t('discard-changes-dialog.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
