<script setup lang="ts">
import type { Application } from '@rpg-together/models'
import { useApplicationsStore } from '~/stores'

const props = defineProps<{ application: Application }>()

const emits = defineEmits<{ (_e: 'close'): void; (_e: 'accept'): void }>()

const applicationsStore = useApplicationsStore()
const { acceptingApplication } = storeToRefs(applicationsStore)

const cardRef = ref<HTMLElement>()

function closeModal() {
  if (acceptingApplication.value)
    return
  emits('close')
}

async function acceptApplication() {
  const error = await applicationsStore.acceptApplication(props.application.id)
  if (!error)
    emits('accept')
  closeModal()
}

onClickOutside(cardRef, () => closeModal())
</script>

<template>
  <div class="modal justify-center">
    <div ref="cardRef" class="card-secondary gap-2 lg:gap-3 w-full lg:max-w-xl lg:mx-auto">
      <h1 class="text-accent font-semibold lg:text-lg">
        {{ $t('components.my-tables.application-card.accept-modal.title') }}
      </h1>
      <i18n-t keypath="components.my-tables.application-card.accept-modal.message" tag="p" scope="global" class="text-sm lg:text-base">
        <template #user>
          <span class="font-semibold">
            {{ application?.applicant.username }}
          </span>
        </template>
      </i18n-t>
      <LoadingCard v-if="acceptingApplication" />
      <div v-else class="grid grid-cols-2 gap-3 mt-3">
        <button class="btn btn-primary" @click.prevent="closeModal">
          {{ $t('components.my-tables.application-card.accept-modal.back') }}
        </button>
        <button class="btn btn-accent" @click.prevent="acceptApplication">
          {{ $t('components.my-tables.application-card.accept-modal.yes-accept') }}
        </button>
      </div>
    </div>
  </div>
</template>
