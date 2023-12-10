<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { object, string } from 'zod'
import { useUserStore } from '~/stores'

definePageMeta({ middleware: ['logged-out'] })

useHead({ title: useNuxtApp().$i18n.t('pages.login.title') })

const localePath = useLocalePath()
const userStore = useUserStore()
const { signingIn } = storeToRefs(userStore)

const formFields = {
  email: {
    name: 'email',
    label: 'pages.login.form.email.label',
    placeholder: 'pages.login.form.email.placeholder',
  },
  password: {
    name: 'password',
    label: 'pages.login.form.password.label',
    placeholder: 'pages.login.form.password.placeholder',
  },
}
const validationSchema = toTypedSchema(
  object({
    email: string().email(),
    password: string().min(6),
  }),
)
const { errors, handleSubmit } = useForm({ validationSchema })
const { value: emailValue } = useField<string>(formFields.email.name)
const { value: passwordValue } = useField<string>(formFields.password.name)

const apiError = ref<string>()

const onSubmit = handleSubmit(async (values) => {
  apiError.value = await userStore.signIn(values.email, values.password)
})
</script>

<template>
  <div class="flex flex-col gap-5 lg:gap-7">
    <PageTitle :title="$t('pages.login.title')" />
    <div class="flex flex-col gap-5 px-2 w-full lg:gap-7 lg:px-0 lg:max-w-xl lg:mx-auto">
      <i18n-t keypath="pages.login.no-account" tag="div" scope="global" class="flex flex-col text-center lg:text-lg">
        <NuxtLink :to="localePath({ name: 'register' })" class="text-accent font-medium">
          {{ $t('pages.login.register-here') }}
        </NuxtLink>
      </i18n-t>
      <div class="flex flex-col gap-3">
        <FormInput
          v-model="emailValue"
          :name="formFields.email.name"
          :label="$t(formFields.email.label)"
          :placeholder="$t(formFields.email.placeholder)"
          :error="errors.email ? $t(errors.email, { label: $t(formFields.email.label) }) : ''"
          autocomplete="off"
          type="email"
          :disabled="signingIn"
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
          :disabled="signingIn"
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
      <LoadingCard v-if="signingIn" />
      <button v-else class="btn-accent" :disabled="signingIn" @click.prevent="onSubmit">
        <p>
          {{ $t('pages.login.submit') }}
        </p>
      </button>
      <RecaptchaWarning />
    </div>
  </div>
</template>
