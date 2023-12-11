<script setup lang="ts">
import { object, string } from 'zod'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { User } from '@rpg-together/models'
import { useUserStore } from '~/stores'

defineProps<{ user: User | null }>()
const emits = defineEmits<{ (_e: 'close'): void }>()

const userStore = useUserStore()
const { changingUsername } = storeToRefs(userStore)

const cardRef = ref<HTMLElement>()
onClickOutside(cardRef, () => {
  emits('close')
})

const formFields = {
  username: {
    name: 'username',
    label: 'components.profile.change-username-modal.form.username.label',
    placeholder: 'components.profile.change-username-modal.form.username.placeholder',
  },
  password: {
    name: 'password',
    label: 'components.profile.change-username-modal.form.password.label',
    placeholder: 'components.profile.change-username-modal.form.password.placeholder',
  },
}

const validationSchema = toTypedSchema(
  object({
    username: string().min(1),
    password: string().min(6),
  }),
)

const { errors, handleSubmit } = useForm({ validationSchema })
const { value: usernameValue } = useField<string>(formFields.username.name)
const { value: passwordValue } = useField<string>(formFields.password.name)
const apiError = ref('')

const onSubmit = handleSubmit(async (values) => {
  apiError.value = ''
  const response = await userStore.changeUsername({ username: values.username, password: values.password })
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
        {{ $t('components.profile.change-username-modal.title') }}
      </h1>
      <i18n-t keypath="components.profile.change-username-modal.current-name" tag="p" scope="global" class="text-sm lg:text-base">
        <template #name>
          <span class="font-semibold">{{ user?.username }}</span>
        </template>
      </i18n-t>
      <FormInput
        v-model="usernameValue"
        :name="formFields.username.name"
        :label="$t(formFields.username.label)"
        :placeholder="$t(formFields.username.placeholder)"
        :error="errors.username ? $t(errors.username, { label: $t(formFields.username.label) }) : ''"
        :disabled="changingUsername"
        autocomplete="off"
      >
        <template #field-icon>
          <NuxtIcon name="user" />
        </template>
      </FormInput>
      <FormInput
        v-model="passwordValue"
        :name="formFields.password.name"
        :label="$t(formFields.password.label)"
        :placeholder="$t(formFields.password.placeholder)"
        :error="errors.password ? $t(errors.password, { label: $t(formFields.password.label), min: 6 }) : ''"
        :disabled="changingUsername"
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
      <LoadingCard v-if="changingUsername" class="mt-3" />
      <div v-else class="flex flex-col gap-3 mt-3">
        <div class="grid grid-cols-2 gap-3">
          <button class="btn btn-primary" @click.prevent="emits('close')">
            {{ $t('components.profile.change-username-modal.back') }}
          </button>
          <button class="btn btn-accent" @click.prevent="onSubmit">
            {{ $t('components.profile.change-username-modal.save') }}
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
