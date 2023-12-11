<script setup lang="ts">
import { object, string } from 'zod'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { User } from '@rpg-together/models'
import { useUserStore } from '~/stores'

defineProps<{ user: User | null }>()
const emits = defineEmits<{ (_e: 'close'): void }>()

const userStore = useUserStore()
const { deletingAccount } = storeToRefs(userStore)

const cardRef = ref<HTMLElement>()
const confirmCardRef = ref<HTMLElement>()
onClickOutside(cardRef, () => {
  emits('close')
})
onClickOutside(confirmCardRef, () => {
  emits('close')
})

const showConfirmCard = ref(false)

const formFields = {
  password: {
    name: 'password',
    label: 'components.profile.delete-account-modal.form.password.label',
    placeholder: 'components.profile.delete-account-modal.form.password.placeholder',
  },
}

const validationSchema = toTypedSchema(
  object({
    password: string().min(6),
  }),
)

const { errors, handleSubmit } = useForm({ validationSchema })
const { value: passwordValue } = useField<string>(formFields.password.name)
const apiError = ref('')

const onSubmit = handleSubmit(async (values) => {
  apiError.value = ''
  const response = await userStore.deleteAuth(values.password)
  if (response) {
    apiError.value = response
    return
  }
  emits('close')
})
</script>

<template>
  <div class="modal justify-center p-3 lg:p-0">
    <div v-if="showConfirmCard" ref="confirmCardRef" class="card-primary gap-3 w-full lg:max-w-xl lg:mx-auto">
      <h1 class="text-danger font-semibold lg:text-lg">
        {{ $t('components.profile.delete-account-modal.title') }}
      </h1>
      <p class="text-sm lg:text-base">
        {{ $t('components.profile.delete-account-modal.confirmation') }}
      </p>
      <FormInput
        v-model="passwordValue"
        :name="formFields.password.name"
        :label="$t(formFields.password.label)"
        :placeholder="$t(formFields.password.placeholder)"
        :error="errors.password ? $t(errors.password, { label: $t(formFields.password.label), min: 6 }) : ''"
        :disabled="deletingAccount"
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
      <LoadingCard v-if="deletingAccount" class="mt-3" />
      <div v-else class="flex flex-col gap-3 mt-3">
        <div class="grid grid-cols-2 gap-3">
          <button class="btn btn-accent" @click.prevent="showConfirmCard = false">
            {{ $t('components.profile.delete-account-modal.back') }}
          </button>
          <button class="btn btn-danger" @click.prevent="onSubmit">
            {{ $t('components.profile.delete-account-modal.confirm') }}
          </button>
        </div>
        <span v-if="apiError" class="relative px-2 py-1 self-end text-sm bg-danger rounded">
          <p>{{ apiError }}</p>
          <div class="absolute bottom-full" />
        </span>
      </div>
    </div>
    <div v-else ref="cardRef" class="card-primary gap-3 w-full lg:max-w-xl lg:mx-auto">
      <h1 class="text-danger font-semibold lg:text-lg">
        {{ $t('components.profile.delete-account-modal.title') }}
      </h1>
      <div class="flex flex-col gap-2 text-sm lg:text-base">
        <p>{{ $t('components.profile.delete-account-modal.warnings[0]') }}</p>
        <p>{{ $t('components.profile.delete-account-modal.warnings[1]') }}</p>
        <p class="font-semibold">
          {{ $t('components.profile.delete-account-modal.warnings[2]') }}
        </p>
      </div>
      <LoadingCard v-if="deletingAccount" class="mt-3" />
      <div v-else class="flex flex-col gap-3 mt-3">
        <div class="grid grid-cols-2 gap-3">
          <button class="btn btn-accent" @click.prevent="emits('close')">
            {{ $t('components.profile.delete-account-modal.back') }}
          </button>
          <button class="btn btn-primary" @click.prevent="showConfirmCard = true">
            {{ $t('components.profile.delete-account-modal.understand') }}
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
