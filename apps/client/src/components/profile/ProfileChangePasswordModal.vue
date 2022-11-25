<script setup lang="ts">
import { object, string } from 'zod';
import { useForm, useField } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';
import { useUserStore } from '~/stores';
import { User } from '@rpg-together/models';

defineProps<{ user: User | null }>();
const emits = defineEmits<{ (e: 'close'): void }>();

const userStore = useUserStore();
const { changingAuthData } = storeToRefs(userStore);

const cardRef = ref<HTMLElement>();
onClickOutside(cardRef, () => {
  emits('close');
});

const formFields = {
  ['old-password']: {
    name: 'old-password',
    label: 'profile-change-password-modal.form.old-password.label',
    placeholder: 'profile-change-password-modal.form.old-password.placeholder',
  },
  ['new-password']: {
    name: 'new-password',
    label: 'profile-change-password-modal.form.new-password.label',
    placeholder: 'profile-change-password-modal.form.new-password.placeholder',
  },
  ['confirm-password']: {
    name: 'confirm-password',
    label: 'profile-change-password-modal.form.confirm-password.label',
    placeholder: 'profile-change-password-modal.form.confirm-password.placeholder',
  },
};

const validationSchema = toFormValidator(
  object({
    ['old-password']: string().min(6),
    ['new-password']: string().min(6),
    ['confirm-password']: string().min(6),
  }).refine((data) => data['new-password'] === data['confirm-password'], {
    message: 'zod-errors.password-match',
    path: ['confirm-password'],
  })
);

const { errors, handleSubmit } = useForm({ validationSchema });
const { value: oldPasswordValue } = useField(formFields['old-password'].name);
const { value: newPasswordValue } = useField(formFields['new-password'].name);
const { value: confirmPasswordValue } = useField(formFields['confirm-password'].name);
const apiError = ref('');

const onSubmit = handleSubmit(async (values) => {
  apiError.value = '';
  const response = await userStore.changeAuthData({
    password: values['old-password'],
    newPassword: values['new-password'],
  });
  if (response) {
    apiError.value = response;
    return;
  }
  emits('close');
});
</script>

<template>
  <div class="modal justify-center p-3">
    <div ref="cardRef" class="card gap-3">
      <h1 class="font-semibold">{{ $t('profile-change-password-modal.title') }}</h1>
      <FormInput
        :name="formFields['old-password'].name"
        :label="$t(formFields['old-password'].label)"
        :placeholder="$t(formFields['old-password'].placeholder)"
        :error="
          errors['old-password'] ? $t(errors['old-password'], { label: $t(formFields['old-password'].label), min: 6 }) : ''
        "
        :disabled="changingAuthData"
        v-model="oldPasswordValue"
        autocomplete="off"
        type="password"
        class="mb-3"
      >
        <template #field-icon><Icon name="material-symbols:key" /></template>
        <template #show-password-icon><Icon name="bi:eye-fill" /></template>
        <template #hide-password-icon><Icon name="bi:eye-slash-fill" /></template>
      </FormInput>
      <FormInput
        :name="formFields['new-password'].name"
        :label="$t(formFields['new-password'].label)"
        :placeholder="$t(formFields['new-password'].placeholder)"
        :error="
          errors['new-password'] ? $t(errors['new-password'], { label: $t(formFields['new-password'].label), min: 6 }) : ''
        "
        :disabled="changingAuthData"
        v-model="newPasswordValue"
        autocomplete="off"
        type="password"
      >
        <template #field-icon><Icon name="material-symbols:key" /></template>
        <template #show-password-icon><Icon name="bi:eye-fill" /></template>
        <template #hide-password-icon><Icon name="bi:eye-slash-fill" /></template>
      </FormInput>
      <FormInput
        :name="formFields['confirm-password'].name"
        :label="$t(formFields['confirm-password'].label)"
        :placeholder="$t(formFields['confirm-password'].placeholder)"
        :error="
          errors['confirm-password']
            ? $t(errors['confirm-password'], { label: $t(formFields['confirm-password'].label), min: 6 })
            : ''
        "
        :disabled="changingAuthData"
        v-model="confirmPasswordValue"
        autocomplete="off"
        type="password"
      >
        <template #field-icon><Icon name="material-symbols:key" /></template>
        <template #show-password-icon><Icon name="bi:eye-fill" /></template>
        <template #hide-password-icon><Icon name="bi:eye-slash-fill" /></template>
      </FormInput>
      <LoadingCard v-if="changingAuthData" class="mt-3" />
      <div v-else class="flex flex-col gap-3 mt-3">
        <div class="grid grid-cols-2 gap-3">
          <button class="btn-primary" @click.prevent="emits('close')">
            {{ $t('profile-change-password-modal.back') }}
          </button>
          <button class="btn-accent" @click.prevent="onSubmit">{{ $t('profile-change-password-modal.save') }}</button>
        </div>
        <span v-if="apiError" class="relative px-2 py-1 self-end text-sm bg-red-500 rounded">
          <p>{{ apiError }}</p>
          <div class="absolute bottom-full"></div>
        </span>
      </div>
    </div>
  </div>
</template>
