<script setup lang="ts">
import type { Application } from '@rpg-together/models'
import { useApplicationsStore } from '~/stores'

const props = defineProps<{ show: boolean; application: Application }>()

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
  <Transition name="fade">
    <div v-if="show" class="modal justify-center p-3">
      <div ref="cardRef" class="card-primary gap-3">
        <h1 class="text-accent font-semibold">
          {{ $t('my-tables-application-card.accept-modal.title') }}
        </h1>
        <i18n-t keypath="my-tables-application-card.accept-modal.message" tag="p" scope="global" class="text-sm">
          <template #user>
            <span class="font-semibold">
              {{ application?.applicant.username }}
            </span>
          </template>
        </i18n-t>
        <LoadingCard v-if="acceptingApplication" class="mt-3" />
        <div v-else class="grid grid-cols-2 gap-3 mt-3">
          <button class="btn-primary" @click.prevent="closeModal">
            {{ $t('my-tables-application-card.accept-modal.back') }}
          </button>
          <button class="btn-accent" @click.prevent="acceptApplication">
            {{ $t('my-tables-application-card.accept-modal.yes-accept') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
