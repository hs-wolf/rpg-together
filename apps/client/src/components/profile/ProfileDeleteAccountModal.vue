<script setup lang="ts">
import { object, string } from 'zod';
import { useForm, useField } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';
import { useUserStore } from '~/stores';
import { User } from '@rpg-together/models';

defineProps<{ user: User | null }>();
const emits = defineEmits<{ (e: 'close'): void }>();

const userStore = useUserStore();
const { deletingAccount } = storeToRefs(userStore);

const cardRef = ref<HTMLElement>();
const confirmCardRef = ref<HTMLElement>();
onClickOutside(cardRef, () => {
  emits('close');
});
onClickOutside(confirmCardRef, () => {
  emits('close');
});

const showConfirmCard = ref(false);

const formFields = {
  password: {
    name: 'password',
    label: 'profile-delete-account-modal.form.password.label',
    placeholder: 'profile-delete-account-modal.form.password.placeholder',
  },
};

const validationSchema = toFormValidator(
  object({
    password: string().min(6),
  })
);

const { errors, handleSubmit } = useForm({ validationSchema });
const { value: passwordValue } = useField(formFields.password.name);
const apiError = ref('');

const onSubmit = handleSubmit(async (values) => {
  apiError.value = '';
  const response = await userStore.accountDelete(values.password);
  if (response) {
    apiError.value = response;
    return;
  }
  emits('close');
});
</script>

<template>
  <div class="modal justify-center p-3">
    <div v-if="showConfirmCard" ref="confirmCardRef" class="card-primary gap-3">
      <h1 class="text-danger font-semibold">{{ $t('profile-delete-account-modal.title') }}</h1>
      <p class="text-sm">{{ $t('profile-delete-account-modal.confirmation') }}</p>
      <FormInput
        :name="formFields.password.name"
        :label="$t(formFields.password.label)"
        :placeholder="$t(formFields.password.placeholder)"
        :error="errors.password ? $t(errors.password, { label: $t(formFields.password.label), min: 6 }) : ''"
        :disabled="deletingAccount"
        v-model="passwordValue"
        autocomplete="off"
        type="password"
      >
        <template #field-icon><Icon name="material-symbols:key" /></template>
        <template #show-password-icon><Icon name="bi:eye-fill" /></template>
        <template #hide-password-icon><Icon name="bi:eye-slash-fill" /></template>
      </FormInput>
      <LoadingCard v-if="deletingAccount" class="mt-3" />
      <div v-else class="flex flex-col gap-3 mt-3">
        <div class="grid grid-cols-2 gap-3">
          <button class="btn-accent" @click.prevent="showConfirmCard = false">
            {{ $t('profile-delete-account-modal.back') }}
          </button>
          <button class="btn-danger" @click.prevent="onSubmit">
            {{ $t('profile-delete-account-modal.confirm') }}
          </button>
        </div>
        <span v-if="apiError" class="relative px-2 py-1 self-end text-sm bg-danger rounded">
          <p>{{ apiError }}</p>
          <div class="absolute bottom-full"></div>
        </span>
      </div>
    </div>
    <div v-else ref="cardRef" class="card-primary gap-3">
      <h1 class="text-danger font-semibold">{{ $t('profile-delete-account-modal.title') }}</h1>
      <div class="flex flex-col gap-2 text-sm">
        <p>{{ $t('profile-delete-account-modal.warnings[0]') }}</p>
        <p>{{ $t('profile-delete-account-modal.warnings[1]') }}</p>
        <p class="font-semibold">{{ $t('profile-delete-account-modal.warnings[2]') }}</p>
      </div>
      <LoadingCard v-if="deletingAccount" class="mt-3" />
      <div v-else class="flex flex-col gap-3 mt-3">
        <div class="grid grid-cols-2 gap-3">
          <button class="btn-accent" @click.prevent="emits('close')">
            {{ $t('profile-delete-account-modal.back') }}
          </button>
          <button class="btn-primary" @click.prevent="showConfirmCard = true">
            {{ $t('profile-delete-account-modal.understand') }}
          </button>
        </div>
        <span v-if="apiError" class="relative px-2 py-1 self-end text-sm bg-danger rounded">
          <p>{{ apiError }}</p>
          <div class="absolute bottom-full"></div>
        </span>
      </div>
    </div>
  </div>
</template>
