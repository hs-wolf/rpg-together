<script setup lang="ts">
import { object, string } from 'zod'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { User } from '@rpg-together/models'
import { useUserStore } from '~/stores'

defineProps<{ user: User | null }>()

const emits = defineEmits<{ (_e: 'close'): void }>()

const userStore = useUserStore()
const { changingAuthData } = storeToRefs(userStore)

const formFields = {
  'email': {
    name: 'email',
    label: 'components.profile.change-email-modal.form.email.label',
    placeholder: 'components.profile.change-email-modal.form.email.placeholder',
  },
  'confirm-email': {
    name: 'confirm-email',
    label: 'components.profile.change-email-modal.form.confirm-email.label',
    placeholder: 'components.profile.change-email-modal.form.confirm-email.placeholder',
  },
  'password': {
    name: 'password',
    label: 'components.profile.change-email-modal.form.password.label',
    placeholder: 'components.profile.change-email-modal.form.password.placeholder',
  },
}

const validationSchema = toTypedSchema(
  object({
    'email': string().email(),
    'confirm-email': string().email(),
    'password': string().min(6),
  }).refine(data => data.email === data['confirm-email'], {
    message: 'zod-errors.email-match',
    path: ['confirm-email'],
  }),
)

const { errors, handleSubmit } = useForm({ validationSchema })
const { value: emailValue } = useField<string>(formFields.email.name)
const { value: confirmEmailValue } = useField<string>(formFields['confirm-email'].name)
const { value: passwordValue } = useField<string>(formFields.password.name)
const apiError = ref('')
const cardRef = ref<HTMLElement>()

const onSubmit = handleSubmit(async (values) => {
  apiError.value = ''
  const response = await userStore.changeAuthData({
    password: values.password,
    newEmail: values.email,
  })
  if (response) {
    apiError.value = response
    return
  }
  emits('close')
})

onClickOutside(cardRef, () => {
  emits('close')
})
</script>

<template>
  <div class="modal justify-center p-3 lg:p-0">
    <div ref="cardRef" class="card-primary gap-3 w-full lg:max-w-xl lg:mx-auto">
      <h1 class="font-semibold lg:text-lg">
        {{ $t('components.profile.change-email-modal.title') }}
      </h1>
      <i18n-t keypath="components.profile.change-email-modal.current-email" tag="p" scope="global" class="text-sm lg:text-base">
        <template #email>
          <span class="font-semibold">{{ user?.email }}</span>
        </template>
      </i18n-t>
      <FormInput
        v-model="emailValue"
        :name="formFields.email.name"
        :label="$t(formFields.email.label)"
        :placeholder="$t(formFields.email.placeholder)"
        :error="errors.email ? $t(errors.email, { label: $t(formFields.email.label) }) : ''"
        autocomplete="off"
        type="email"
        :disabled="changingAuthData"
      >
        <template #field-icon>
          <NuxtIcon name="email" />
        </template>
      </FormInput>
      <FormInput
        v-model="confirmEmailValue"
        :name="formFields['confirm-email'].name"
        :label="$t(formFields['confirm-email'].label)"
        :placeholder="$t(formFields['confirm-email'].placeholder)"
        :error="errors['confirm-email'] ? $t(errors['confirm-email'], { label: $t(formFields['confirm-email'].label) }) : ''"
        autocomplete="off"
        type="email"
        :disabled="changingAuthData"
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
        :disabled="changingAuthData"
        autocomplete="off"
        type="password"
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
      <LoadingCard v-if="changingAuthData" class="mt-3" />
      <div v-else class="flex flex-col gap-3 mt-3">
        <div class="grid grid-cols-2 gap-3">
          <button class="btn btn-primary" @click.prevent="emits('close')">
            {{ $t('components.profile.change-email-modal.back') }}
          </button>
          <button class="btn btn-accent" @click.prevent="onSubmit">
            {{ $t('components.profile.change-email-modal.save') }}
          </button>
        </div>
        <span v-if="apiError" class="relative px-2 py-1 self-end text-sm bg-danger rounded">
          <p>{{ apiError }}</p>
          <div class="absolute bottom-full" />
        </span>
      </div>
    </div>
  </div>
</template>
