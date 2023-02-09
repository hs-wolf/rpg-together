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
  email: {
    name: 'email',
    label: 'profile-change-email-modal.form.email.label',
    placeholder: 'profile-change-email-modal.form.email.placeholder',
  },
  ['confirm-email']: {
    name: 'confirm-email',
    label: 'profile-change-email-modal.form.confirm-email.label',
    placeholder: 'profile-change-email-modal.form.confirm-email.placeholder',
  },
  password: {
    name: 'password',
    label: 'profile-change-email-modal.form.password.label',
    placeholder: 'profile-change-email-modal.form.password.placeholder',
  },
};

const validationSchema = toFormValidator(
  object({
    email: string().email(),
    ['confirm-email']: string().email(),
    password: string().min(6),
  }).refine((data) => data.email === data['confirm-email'], {
    message: 'zod-errors.email-match',
    path: ['confirm-email'],
  })
);

const { errors, handleSubmit } = useForm({ validationSchema });
const { value: emailValue } = useField(formFields.email.name);
const { value: confirmEmailValue } = useField(formFields['confirm-email'].name);
const { value: passwordValue } = useField(formFields.password.name);
const apiError = ref('');

const onSubmit = handleSubmit(async (values) => {
  apiError.value = '';
  const response = await userStore.changeAuthData({
    password: values.password,
    newEmail: values.email,
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
    <div ref="cardRef" class="card-primary gap-3">
      <h1 class="font-semibold">{{ $t('profile-change-email-modal.title') }}</h1>
      <i18n-t keypath="profile-change-email-modal.current-email" tag="p" scope="global" class="text-sm">
        <template v-slot:email>
          <span class="font-semibold">{{ user?.email }}</span>
        </template>
      </i18n-t>
      <FormInput
        :name="formFields.email.name"
        :label="$t(formFields.email.label)"
        :placeholder="$t(formFields.email.placeholder)"
        :error="errors.email ? $t(errors.email, { label: $t(formFields.email.label) }) : ''"
        v-model="emailValue"
        autocomplete="off"
        type="email"
        :disabled="changingAuthData"
      >
        <template #field-icon><NuxtIcon name="email" /></template>
      </FormInput>
      <FormInput
        :name="formFields['confirm-email'].name"
        :label="$t(formFields['confirm-email'].label)"
        :placeholder="$t(formFields['confirm-email'].placeholder)"
        :error="errors['confirm-email'] ? $t(errors['confirm-email'], { label: $t(formFields['confirm-email'].label) }) : ''"
        v-model="confirmEmailValue"
        autocomplete="off"
        type="email"
        :disabled="changingAuthData"
      >
        <template #field-icon><NuxtIcon name="email" /></template>
      </FormInput>
      <FormInput
        :name="formFields.password.name"
        :label="$t(formFields.password.label)"
        :placeholder="$t(formFields.password.placeholder)"
        :error="errors.password ? $t(errors.password, { label: $t(formFields.password.label), min: 6 }) : ''"
        :disabled="changingAuthData"
        v-model="passwordValue"
        autocomplete="off"
        type="password"
      >
        <template #field-icon><NuxtIcon name="key" /></template>
        <template #show-password-icon><NuxtIcon name="eye-open" /></template>
        <template #hide-password-icon><NuxtIcon name="eye-closed" /></template>
      </FormInput>
      <LoadingCard v-if="changingAuthData" class="mt-3" />
      <div v-else class="flex flex-col gap-3 mt-3">
        <div class="grid grid-cols-2 gap-3">
          <button class="btn-primary" @click.prevent="emits('close')">
            {{ $t('profile-change-email-modal.back') }}
          </button>
          <button class="btn-accent" @click.prevent="onSubmit">{{ $t('profile-change-email-modal.save') }}</button>
        </div>
        <span v-if="apiError" class="relative px-2 py-1 self-end text-sm bg-danger rounded">
          <p>{{ apiError }}</p>
          <div class="absolute bottom-full"></div>
        </span>
      </div>
    </div>
  </div>
</template>
