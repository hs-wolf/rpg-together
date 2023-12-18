<script setup lang="ts">
import { object, string } from 'zod'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { AuthUserRegisterBody } from '@rpg-together/models'
import { useUserStore } from '~/stores'

const { t } = useNuxtApp().$i18n
const localePath = useLocalePath()
const userStore = useUserStore()
const { registering } = storeToRefs(userStore)

const formFields = {
  username: {
    name: 'username',
    label: 'pages.register.form.username.label',
    placeholder: 'pages.register.form.username.placeholder',
  },
  email: {
    name: 'email',
    label: 'pages.register.form.email.label',
    placeholder: 'pages.register.form.email.placeholder',
  },
  password: {
    name: 'password',
    label: 'pages.register.form.password.label',
    placeholder: 'pages.register.form.password.placeholder',
  },
  confirmPassword: {
    name: 'confirmPassword',
    label: 'pages.register.form.confirmPassword.label',
    placeholder: 'pages.register.form.confirmPassword.placeholder',
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
const apiError = ref<string>()

const onSubmit = handleSubmit(async (values) => {
  const body: AuthUserRegisterBody = { username: values.username, email: values.email, password: values.password }
  apiError.value = await userStore.register(body)
})

definePageMeta({ middleware: ['logged-out'] })

useHead({ title: t('pages.register.title') })
</script>

<template>
  <div class="flex flex-col gap-5 lg:gap-7">
    <PageTitle :title="$t('pages.register.title')" />
    <div class="flex flex-col gap-5 px-2 w-full lg:gap-7 lg:px-0 lg:max-w-xl lg:mx-auto">
      <i18n-t keypath="pages.register.existing-account" tag="div" scope="global" class="flex flex-col text-center text lg:text-lg">
        <NuxtLink :to="localePath({ name: 'login' })" class="text-accent font-semibold">
          {{ $t('pages.register.login-here') }}
        </NuxtLink>
      </i18n-t>
      <div class="flex flex-col gap-3">
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
        <span v-if="apiError" class="text-end text-danger-1 text-sm lg:text-base">{{ apiError }}</span>
      </div>
      <LoadingCard v-if="registering" />
      <button v-else class="btn btn-accent" :disabled="registering" @click.prevent="onSubmit">
        <p>
          {{ $t('pages.register.submit') }}
        </p>
      </button>
      <RecaptchaWarning />
    </div>
  </div>
</template>
