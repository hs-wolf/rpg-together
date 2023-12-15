<script setup lang="ts">
import { object, string } from 'zod'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { Application } from '@rpg-together/models'
import { useApplicationsStore } from '~/stores'

const props = defineProps<{ application: Application }>()

const emits = defineEmits<{ (_e: 'close'): void }>()

const applicationsStore = useApplicationsStore()
const { deletingApplication } = storeToRefs(applicationsStore)

const cardRef = ref<HTMLElement>()
const showConfirmCard = ref(false)
const confirmCardRef = ref<HTMLElement>()
onClickOutside(cardRef, () => closeModal())
onClickOutside(confirmCardRef, () => closeModal())

function closeModal() {
  showConfirmCard.value = false
  emits('close')
}

const formFields = {
  password: {
    name: 'password',
    label: 'components.my-applications.delete-application-modal.form.password.label',
    placeholder: 'components.my-applications.delete-application-modal.form.password.placeholder',
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
  const response = await applicationsStore.deleteApplication(props.application.id, values.password)
  if (response) {
    apiError.value = response
    return
  }
  closeModal()
})
</script>

<template>
  <div class="modal justify-center">
    <div v-if="showConfirmCard" ref="confirmCardRef" class="card-secondary gap-2 lg:gap-3 w-full lg:max-w-xl lg:mx-auto">
      <h1 class="text-danger font-semibold lg:text-lg">
        {{ $t('components.my-applications.delete-application-modal.title') }}
      </h1>
      <p class="text-sm lg:text-base">
        {{ $t('components.my-applications.delete-application-modal.confirmation') }}
      </p>
      <LoadingCard v-if="deletingApplication" />
      <div v-else class="flex flex-col gap-2 lg:gap-3">
        <FormInput
          v-model="passwordValue"
          type="password"
          :name="formFields.password.name"
          :label="$t(formFields.password.label)"
          :placeholder="$t(formFields.password.placeholder)"
          autocomplete="off"
          :disabled="deletingApplication"
          :error="errors.password"
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
        <div class="flex flex-col gap-2 lg:gap-3 mt-2 lg:mt-3">
          <div class="grid grid-cols-2 gap-2 lg:gap-3">
            <button class="btn btn-primary" @click.prevent="showConfirmCard = false">
              {{ $t('components.my-applications.delete-application-modal.back') }}
            </button>
            <button class="btn btn-danger" @click.prevent="onSubmit">
              {{ $t('components.my-applications.delete-application-modal.confirm') }}
            </button>
          </div>
          <FormErrorMessage :error="apiError ?? ''" />
        </div>
      </div>
    </div>
    <div v-else ref="cardRef" class="card-secondary gap-2 lg:gap-3 w-full lg:max-w-xl lg:mx-auto">
      <h1 class="text-danger font-semibold lg:text-lg">
        {{ $t('components.my-applications.delete-application-modal.title') }}
      </h1>
      <p class="text-sm lg:text-base">
        {{ $t('components.my-applications.delete-application-modal.warning') }}
      </p>
      <div class="grid grid-cols-2 gap-2 lg:gap-3 mt-2 lg:mt-3">
        <button class="btn btn-primary" @click.prevent="closeModal">
          {{ $t('components.my-applications.delete-application-modal.back') }}
        </button>
        <button class="btn btn-secondary" @click.prevent="showConfirmCard = true">
          {{ $t('components.my-applications.delete-application-modal.understand') }}
        </button>
      </div>
    </div>
  </div>
</template>
