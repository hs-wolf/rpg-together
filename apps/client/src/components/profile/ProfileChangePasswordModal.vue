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

const cardRef = ref<HTMLElement>()
onClickOutside(cardRef, () => {
  emits('close')
})

const formFields = {
  'old-password': {
    name: 'old-password',
    label: 'components.profile.change-password-modal.form.old-password.label',
    placeholder: 'components.profile.change-password-modal.form.old-password.placeholder',
  },
  'new-password': {
    name: 'new-password',
    label: 'components.profile.change-password-modal.form.new-password.label',
    placeholder: 'components.profile.change-password-modal.form.new-password.placeholder',
  },
  'confirm-password': {
    name: 'confirm-password',
    label: 'components.profile.change-password-modal.form.confirm-password.label',
    placeholder: 'components.profile.change-password-modal.form.confirm-password.placeholder',
  },
}

const validationSchema = toTypedSchema(
  object({
    'old-password': string().min(6),
    'new-password': string().min(6),
    'confirm-password': string().min(6),
  }).refine(data => data['new-password'] === data['confirm-password'], {
    message: 'zod-errors.password-match',
    path: ['confirm-password'],
  }),
)

const { errors, handleSubmit } = useForm({ validationSchema })
const { value: oldPasswordValue } = useField<string>(formFields['old-password'].name)
const { value: newPasswordValue } = useField<string>(formFields['new-password'].name)
const { value: confirmPasswordValue } = useField<string>(formFields['confirm-password'].name)
const apiError = ref('')

const onSubmit = handleSubmit(async (values) => {
  apiError.value = ''
  const response = await userStore.changeAuthData({
    password: values['old-password'],
    newPassword: values['new-password'],
  })
  if (response) {
    apiError.value = response
    return
  }
  emits('close')
})
</script>

<template>
  <div class="modal justify-center p-3 lg:p-0">
    <div ref="cardRef" class="card-primary gap-3 w-full lg:max-w-xl lg:mx-auto">
      <h1 class="font-semibold lg:text-lg">
        {{ $t('components.profile.change-password-modal.title') }}
      </h1>
      <FormInput
        v-model="oldPasswordValue"
        :name="formFields['old-password'].name"
        :label="$t(formFields['old-password'].label)"
        :placeholder="$t(formFields['old-password'].placeholder)"
        :error="
          errors['old-password'] ? $t(errors['old-password'], { label: $t(formFields['old-password'].label), min: 6 }) : ''
        "
        :disabled="changingAuthData"
        autocomplete="off"
        type="password"
        class="mb-3"
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
        v-model="newPasswordValue"
        :name="formFields['new-password'].name"
        :label="$t(formFields['new-password'].label)"
        :placeholder="$t(formFields['new-password'].placeholder)"
        :error="
          errors['new-password'] ? $t(errors['new-password'], { label: $t(formFields['new-password'].label), min: 6 }) : ''
        "
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
      <FormInput
        v-model="confirmPasswordValue"
        :name="formFields['confirm-password'].name"
        :label="$t(formFields['confirm-password'].label)"
        :placeholder="$t(formFields['confirm-password'].placeholder)"
        :error="
          errors['confirm-password']
            ? $t(errors['confirm-password'], { label: $t(formFields['confirm-password'].label), min: 6 })
            : ''
        "
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
          <button class="btn-primary" @click.prevent="emits('close')">
            {{ $t('components.profile.change-password-modal.back') }}
          </button>
          <button class="btn-accent" @click.prevent="onSubmit">
            {{ $t('components.profile.change-password-modal.save') }}
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
