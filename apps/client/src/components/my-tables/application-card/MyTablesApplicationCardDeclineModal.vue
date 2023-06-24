<script setup lang="ts">
import { useApplicationsStore } from '~/stores';
import { Application } from '@rpg-together/models';

const props = defineProps<{ show: boolean; application: Application }>();

const emits = defineEmits<{ (e: 'close'): void; (e: 'decline'): void }>();

const applicationsStore = useApplicationsStore();
const { decliningApplication } = storeToRefs(applicationsStore);

const cardRef = ref<HTMLElement>();
onClickOutside(cardRef, () => emits('close'));

const closeModal = () => {
  if (decliningApplication.value) {
    return;
  }
  emits('close');
};

const declineApplication = async () => {
  const error = await applicationsStore.declineApplication(props.application.id);
  if (!error) {
    emits('decline');
  }
  closeModal();
};
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="modal justify-center p-3">
      <div ref="cardRef" class="card-primary gap-3">
        <h1 class="text-danger font-semibold">{{ $t('my-tables-application-card.decline-modal.title') }}</h1>
        <i18n-t keypath="my-tables-application-card.decline-modal.message" tag="p" scope="global" class="text-sm">
          <template #user>
            <span class="font-semibold">
              {{ application?.applicantHeader.username }}
            </span>
          </template>
        </i18n-t>
        <LoadingCard v-if="decliningApplication" class="mt-3" />
        <div v-else class="grid grid-cols-2 gap-3 mt-3">
          <button class="btn-primary" @click.prevent="closeModal">
            {{ $t('my-tables-application-card.decline-modal.back') }}
          </button>
          <button class="btn-danger" @click.prevent="declineApplication">
            {{ $t('my-tables-application-card.decline-modal.yes-accept') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
