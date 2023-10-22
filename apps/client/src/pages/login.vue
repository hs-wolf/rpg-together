<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { useI18n } from 'vue-i18n'
import { object, string } from 'zod'
import { useUserStore } from '~/stores'

definePageMeta({ middleware: ['logged-out'] })

useHead({ title: useI18n().t('login.title') })

const localePath = useLocalePath()
const userStore = useUserStore()
const { signingIn } = storeToRefs(userStore)

const formFields = {
  email: {
    name: 'email',
    label: 'login.form.email.label',
    placeholder: 'login.form.email.placeholder',
  },
  password: {
    name: 'password',
    label: 'login.form.password.label',
    placeholder: 'login.form.password.placeholder',
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

const onSubmit = handleSubmit(async (values) => {
  await userStore.signIn(values.email, values.password)
})
</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('login.title')" />
    <div class="flex flex-col gap-8 px-2">
      <div class="flex flex-col gap-4">
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
      </div>
      <button class="btn-accent" :disabled="signingIn" @click.prevent="onSubmit">
        <NuxtIcon v-if="signingIn" name="loading-loop" class="text-xl" />
        <p v-else>
          {{ $t('login.submit') }}
        </p>
      </button>
      <i18n-t keypath="login.no-account" tag="div" scope="global" class="text-center text-sm">
        <NuxtLink :to="localePath({ name: 'register' })" class="text-accent font-medium">
          {{ $t('login.register-here') }}
        </NuxtLink>
      </i18n-t>
    </div>
  </div>
</template>
