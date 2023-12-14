<script setup lang="ts">
import { object, string } from 'zod'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { Table } from '@rpg-together/models'
import { useTablesStore } from '~/stores'

const props = defineProps<{ table?: Table }>()
const emits = defineEmits<{ (_e: 'close'): void }>()

const tablesStore = useTablesStore()
const { deletingTable } = storeToRefs(tablesStore)

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
    label: 'components.my-tables.delete-table.form.password.label',
    placeholder: 'components.my-tables.delete-table.form.password.placeholder',
  },
}

const validationSchema = toTypedSchema(
  object({
    password: string().min(6),
  }),
)

const { errors, handleSubmit } = useForm({ validationSchema })
const { value: passwordValue } = useField<string>(formFields.password.name)
const apiError = ref<string>()

const onSubmit = handleSubmit(async (values) => {
  apiError.value = ''
  const response = await tablesStore.deleteTable(props.table?.id ?? '', values.password)
  apiError.value = response
  emits('close')
})
</script>

<template>
  <Transition name="fade" appear>
    <div class="modal justify-center">
      <div v-if="showConfirmCard" ref="confirmCardRef" class="card-secondary gap-2 lg:gap-3 w-full lg:max-w-xl lg:mx-auto">
        <h1 class="text-danger font-semibold lg:text-lg">
          {{ $t('components.my-tables.delete-table.title') }}
        </h1>
        <p class="text-sm lg:text-base">
          {{ $t('components.my-tables.delete-table.confirmation') }}
        </p>
        <LoadingCard v-if="deletingTable" />
        <div v-else class="flex flex-col gap-2 lg:gap-3">
          <FormInput
            v-model="passwordValue"
            type="password"
            :name="formFields.password.name"
            :label="$t(formFields.password.label)"
            :placeholder="$t(formFields.password.placeholder)"
            autocomplete="off"
            :disabled="deletingTable"
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
                {{ $t('components.my-tables.delete-table.back') }}
              </button>
              <button class="btn btn-danger" @click.prevent="onSubmit">
                {{ $t('components.my-tables.delete-table.confirm') }}
              </button>
            </div>
            <FormErrorMessage :error="apiError ?? ''" />
          </div>
        </div>
      </div>
      <div v-else ref="cardRef" class="card-secondary gap-2 lg:gap-3 w-full lg:max-w-xl lg:mx-auto">
        <h1 class="text-danger font-semibold lg:text-lg">
          {{ $t('components.my-tables.delete-table.title') }}
        </h1>
        <p class="text-sm lg:text-base">
          {{ $t('components.my-tables.delete-table.warning') }}
        </p>
        <div class="grid grid-cols-2 gap-2 lg:gap-3 mt-2 lg:mt-3">
          <button class="btn btn-primary" @click.prevent="emits('close')">
            {{ $t('components.my-tables.delete-table.back') }}
          </button>
          <button class="btn btn-secondary" @click.prevent="showConfirmCard = true">
            {{ $t('components.my-tables.delete-table.understand') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
