<script setup lang="ts">
import { object, string } from 'zod'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { Table } from '@rpg-together/models'
import { APPLICATION_MESSAGE_MAX_LENGTH } from '@rpg-together/utilities'
import { useApplicationsStore } from '~/stores'

const props = defineProps<{ show: boolean; table?: Table }>()

const emits = defineEmits<{ (_e: 'close'): void; (_e: 'updateExisting'): void }>()

const applicationsStore = useApplicationsStore()
const { sendingApplication } = storeToRefs(applicationsStore)

const cardRef = ref<HTMLDivElement>()
onClickOutside(cardRef, () => {
  if (sendingApplication.value)
    return

  emits('close')
})

const formFields = {
  message: {
    name: 'message',
    label: 'components.tables.apply.form.message.label',
    placeholder: 'components.tables.apply.form.message.placeholder',
  },
}

const formSchema = object({
  [formFields.message.name]: string().min(3).max(APPLICATION_MESSAGE_MAX_LENGTH),
})

const { errors, handleSubmit } = useForm({ validationSchema: toTypedSchema(formSchema) })
const { value: messageValue } = useField<string>(formFields.message.name)
const apiError = ref('')

const onSubmit = handleSubmit(async (values) => {
  apiError.value = ''
  const response = await applicationsStore.sendApplication({
    message: values.message,
    table: { id: props.table?.id },
  })
  if (response) {
    apiError.value = response
    return
  }
  emits('updateExisting')
  emits('close')
})
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="modal justify-center p-3">
      <div ref="cardRef" class="card-primary gap-3">
        <h1 class="font-semibold uppercase">
          {{ table?.title }}
        </h1>
        <FormTextarea
          v-model="messageValue"
          :name="formFields.message.name"
          :label="$t(formFields.message.label)"
          :placeholder="$t(formFields.message.placeholder)"
          :maxlength="APPLICATION_MESSAGE_MAX_LENGTH"
          :rows="7"
          :disabled="sendingApplication"
          :error="errors.message"
        >
          <template #field-icon>
            <NuxtIcon name="apply" />
          </template>
        </FormTextarea>
        <button class="btn-accent mt-3" :disabled="sendingApplication" @click.prevent="onSubmit">
          {{ $t('components.tables.apply.submit') }}
        </button>
      </div>
    </div>
  </Transition>
</template>
