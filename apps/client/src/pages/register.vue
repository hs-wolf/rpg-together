<script setup lang="ts">
import { object, string } from 'zod'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useI18n } from 'vue-i18n'
import type { AuthUserRegisterBody } from '@rpg-together/models'
import { useUserStore } from '~/stores'

definePageMeta({ middleware: ['logged-out'] })
useHead({ title: useI18n().t('register.title') })

const localePath = useLocalePath()
const userStore = useUserStore()
const { registering } = storeToRefs(userStore)

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
}
const validationSchema = toTypedSchema(
  object({
    username: string().min(1),
    email: string().email(),
    password: string().min(6),
    confirmPassword: string().min(6),
  }).refine(data => data.password === data.confirmPassword, {
    message: 'zod-errors.password-match',
    path: ['confirmPassword'],
  }),
)
const { errors, handleSubmit } = useForm({ validationSchema })
const { value: usernameValue } = useField<string>(formFields.username.name)
const { value: emailValue } = useField<string>(formFields.email.name)
const { value: passwordValue } = useField<string>(formFields.password.name)
const { value: confirmPasswordValue } = useField<string>(formFields.confirmPassword.name)

const onSubmit = handleSubmit(async (values) => {
  const body: AuthUserRegisterBody = { username: values.username, email: values.email, password: values.password }
  await userStore.register(body)
})
</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('register.title')" />
    <div class="flex flex-col gap-8 px-2">
      <div class="flex flex-col gap-4">
        <FormInput
          v-model="usernameValue"
          :name="formFields.username.name"
          :label="$t(formFields.username.label)"
          :placeholder="$t(formFields.username.placeholder)"
          :error="errors.username ? $t(errors.username, { label: $t(formFields.username.label) }) : ''"
          autocomplete="off"
          :disabled="registering"
        >
          <template #field-icon>
            <NuxtIcon name="user" />
          </template>
        </FormInput>
        <FormInput
          v-model="emailValue"
          :name="formFields.email.name"
          :label="$t(formFields.email.label)"
          :placeholder="$t(formFields.email.placeholder)"
          :error="errors.email ? $t(errors.email, { label: $t(formFields.email.label) }) : ''"
          autocomplete="off"
          type="email"
          :disabled="registering"
        >
          <template #field-icon>
            <NuxtIcon name="email" />
          </template>
        </FormInput>
        <FormInput
          v-model="passwordValue"
          :name="formFields.password.name"
          :label="$t(formFields.password.label)"
          :placeholder="$t(formFields.password.placeholder)"
          :error="errors.password ? $t(errors.password, { label: $t(formFields.password.label), min: 6 }) : ''"
          autocomplete="off"
          type="password"
          :disabled="registering"
        >
          <template #field-icon>
            <NuxtIcon name="key" />
          </template>
          <template #show-password-icon>
            <NuxtIcon name="eye-open" />
          </template>
          <template #hide-password-icon>
            <NuxtIcon name="eye-closed" />
          </template>
        </FormInput>
        <FormInput
          v-model="confirmPasswordValue"
          :name="formFields.confirmPassword.name"
          :label="$t(formFields.confirmPassword.label)"
          :placeholder="$t(formFields.confirmPassword.placeholder)"
          :error="
            errors.confirmPassword ? $t(errors.confirmPassword, { label: $t(formFields.confirmPassword.label), min: 6 }) : ''
          "
          autocomplete="off"
          type="password"
          :disabled="registering"
        >
          <template #field-icon>
            <NuxtIcon name="key" />
          </template>
          <template #show-password-icon>
            <NuxtIcon name="eye-open" />
          </template>
          <template #hide-password-icon>
            <NuxtIcon name="eye-closed" />
          </template>
        </FormInput>
      </div>
      <button class="btn-accent" :disabled="registering" @click.prevent="onSubmit">
        <NuxtIcon v-if="registering" name="loading-loop" class="text-xl" />
        <p v-else>
          {{ $t('register.submit') }}
        </p>
      </button>
      <i18n-t keypath="register.existing-account" tag="div" scope="global" class="text-center text-sm">
        <NuxtLink :to="localePath({ name: 'login' })" class="text-accent font-medium">
          {{ $t('register.login-here') }}
        </NuxtLink>
      </i18n-t>
    </div>
  </div>
</template>
