<script setup lang="ts">
import { object, string } from 'zod';
import { useForm, useField } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/stores';
import { AuthUserRegisterBody } from '@rpg-together/models';

definePageMeta({ middleware: ['logged-out'] });
useHead({ title: useI18n().t('register.title') });

const userStore = useUserStore();
const { registering } = storeToRefs(userStore);

const formFields = {
  username: {
    name: 'username',
    label: 'register.form.username.label',
    placeholder: 'register.form.username.placeholder',
  },
  email: {
    name: 'email',
    label: 'register.form.email.label',
    placeholder: 'register.form.email.placeholder',
  },
  password: {
    name: 'password',
    label: 'register.form.password.label',
    placeholder: 'register.form.password.placeholder',
  },
  confirmPassword: {
    name: 'confirmPassword',
    label: 'register.form.confirmPassword.label',
    placeholder: 'register.form.confirmPassword.placeholder',
  },
};
const validationSchema = toFormValidator(
  object({
    username: string().min(1),
    email: string().email(),
    password: string().min(6),
    confirmPassword: string().min(6),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'zod-errors.password-match',
    path: ['confirmPassword'],
  })
);
const { errors, handleSubmit } = useForm({ validationSchema });
const { value: usernameValue } = useField(formFields.username.name);
const { value: emailValue } = useField(formFields.email.name);
const { value: passwordValue } = useField(formFields.password.name);
const { value: confirmPasswordValue } = useField(formFields.confirmPassword.name);

const onSubmit = handleSubmit(async (values) => {
  const body: AuthUserRegisterBody = { username: values.username, email: values.email, password: values.password };
  await userStore.register(body);
});
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="$t('register.title')" />
    <div class="flex flex-col gap-6 p-3">
      <div class="flex flex-col gap-3">
        <FormInput
          :name="formFields.username.name"
          :label="$t(formFields.username.label)"
          :placeholder="$t(formFields.username.placeholder)"
          :error="errors.username ? $t(errors.username, { label: $t(formFields.username.label) }) : ''"
          v-model="usernameValue"
          autocomplete="off"
          :disabled="registering"
        >
          <template #field-icon><Icon name="mdi:user" /></template>
        </FormInput>
        <FormInput
          :name="formFields.email.name"
          :label="$t(formFields.email.label)"
          :placeholder="$t(formFields.email.placeholder)"
          :error="errors.email ? $t(errors.email, { label: $t(formFields.email.label) }) : ''"
          v-model="emailValue"
          autocomplete="off"
          type="email"
          :disabled="registering"
        >
          <template #field-icon><Icon name="material-symbols:alternate-email" /></template>
        </FormInput>
        <FormInput
          :name="formFields.password.name"
          :label="$t(formFields.password.label)"
          :placeholder="$t(formFields.password.placeholder)"
          :error="errors.password ? $t(errors.password, { label: $t(formFields.password.label), min: 6 }) : ''"
          v-model="passwordValue"
          autocomplete="off"
          type="password"
          :disabled="registering"
        >
          <template #field-icon><Icon name="material-symbols:key" /></template>
          <template #show-password-icon><Icon name="bi:eye-fill" /></template>
          <template #hide-password-icon><Icon name="bi:eye-slash-fill" /></template>
        </FormInput>
        <FormInput
          :name="formFields.confirmPassword.name"
          :label="$t(formFields.confirmPassword.label)"
          :placeholder="$t(formFields.confirmPassword.placeholder)"
          :error="
            errors.confirmPassword ? $t(errors.confirmPassword, { label: $t(formFields.confirmPassword.label), min: 6 }) : ''
          "
          v-model="confirmPasswordValue"
          autocomplete="off"
          type="password"
          :disabled="registering"
        >
          <template #field-icon><Icon name="material-symbols:key" /></template>
          <template #show-password-icon><Icon name="bi:eye-fill" /></template>
          <template #hide-password-icon><Icon name="bi:eye-slash-fill" /></template>
        </FormInput>
      </div>
      <button class="btn-accent" @click.prevent="onSubmit" :disabled="registering">
        <Icon v-if="registering" name="line-md:loading-loop" class="text-xl" />
        <p v-else>{{ $t('register.submit') }}</p>
      </button>
      <i18n-t keypath="register.existing-account" tag="div" scope="global" class="text-center text-sm">
        <NuxtLink :to="{ name: 'login' }" class="text-accent font-medium">{{ $t('register.login-here') }}</NuxtLink>
      </i18n-t>
    </div>
  </div>
</template>
