<script setup lang="ts">
import { object, string } from 'zod';
import { useForm, useField } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';
import { useApplicationsStore } from '~/stores';
import { Application } from '@rpg-together/models';

const props = defineProps<{ show: boolean; application: Application }>();

const emits = defineEmits<{ (e: 'close'): void }>();

const applicationsStore = useApplicationsStore();
const { deletingApplication } = storeToRefs(applicationsStore);

const cardRef = ref<HTMLElement>();
const showConfirmCard = ref(false);
const confirmCardRef = ref<HTMLElement>();
onClickOutside(cardRef, () => closeModal());
onClickOutside(confirmCardRef, () => closeModal());

const closeModal = () => {
  showConfirmCard.value = false;
  emits('close');
};

const formFields = {
  password: {
    name: 'password',
    label: 'my-applications-delete-application-modal.form.password.label',
    placeholder: 'my-applications-delete-application-modal.form.password.placeholder',
  },
};

const validationSchema = toFormValidator(
  object({
    password: string().min(6),
  })
);

const { errors, handleSubmit } = useForm({ validationSchema });
const { value: passwordValue } = useField<string>(formFields.password.name);

const apiError = ref('');
const onSubmit = handleSubmit(async (values) => {
  apiError.value = '';
  const response = await applicationsStore.deleteApplication(props.application.id, values.password);
  if (response) {
    apiError.value = response;
    return;
  }
  closeModal();
});
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="modal justify-center p-3">
      <div v-if="showConfirmCard" ref="confirmCardRef" class="card-primary gap-3">
        <h1 class="text-danger font-semibold">{{ $t('my-applications-delete-application-modal.title') }}</h1>
        <p class="text-sm">{{ $t('my-applications-delete-application-modal.confirmation') }}</p>
        <FormInput
          type="password"
          :name="formFields.password.name"
          :label="$t(formFields.password.label)"
          :placeholder="$t(formFields.password.placeholder)"
          v-model="passwordValue"
          autocomplete="off"
          :disabled="deletingApplication"
          :error="errors.password"
        >
          <template #field-icon><NuxtIcon name="key" /></template>
          <template #show-password-icon><NuxtIcon name="eye-open" /></template>
          <template #hide-password-icon><NuxtIcon name="eye-closed" /></template>
        </FormInput>
        <LoadingCard v-if="deletingApplication" class="mt-3" />
        <div v-else class="flex flex-col gap-3 mt-3">
          <div class="grid grid-cols-2 gap-3">
            <button class="btn-accent" @click.prevent="showConfirmCard = false">
              {{ $t('my-applications-delete-application-modal.back') }}
            </button>
            <button class="btn-danger" @click.prevent="onSubmit">
              {{ $t('my-applications-delete-application-modal.confirm') }}
            </button>
          </div>
          <FormErrorMessage :error="apiError ?? ''" />
        </div>
      </div>
      <div v-else ref="cardRef" class="card-primary gap-3">
        <h1 class="text-danger font-semibold">{{ $t('my-applications-delete-application-modal.title') }}</h1>
        <p class="text-sm">{{ $t('my-applications-delete-application-modal.warning') }}</p>
        <div class="grid grid-cols-2 gap-3 mt-3">
          <button class="btn-accent" @click.prevent="closeModal">
            {{ $t('my-applications-delete-application-modal.back') }}
          </button>
          <button class="btn-primary" @click.prevent="showConfirmCard = true">
            {{ $t('my-applications-delete-application-modal.understand') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>