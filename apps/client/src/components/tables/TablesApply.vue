<script setup lang="ts">
import { object, string } from 'zod';
import { useForm, useField } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';
import { useApplicationsStore } from '~/stores';
import { Table } from '@rpg-together/models';
import { APPLICATION_MESSAGE_MAX_LENGTH } from '@rpg-together/utils';

const props = defineProps<{ show: boolean; table?: Table }>();

const emits = defineEmits<{ (e: 'close'): void; (e: 'updateExisting'): void }>();

const applicationsStore = useApplicationsStore();
const { sendingApplication } = storeToRefs(applicationsStore);

const cardRef = ref<HTMLDivElement>();
onClickOutside(cardRef, () => {
  if (sendingApplication.value) {
    return;
  }
  emits('close');
});

const formFields = {
  message: {
    name: 'message',
    label: 'tables-apply.form.message.label',
    placeholder: 'tables-apply.form.message.placeholder',
  },
};

const formSchema = object({
  [formFields.message.name]: string().min(3).max(APPLICATION_MESSAGE_MAX_LENGTH),
});

const { errors, handleSubmit } = useForm({ validationSchema: toFormValidator(formSchema) });
const { value: messageValue } = useField<string>(formFields.message.name);
const apiError = ref('');

const onSubmit = handleSubmit(async (values) => {
  apiError.value = '';
  const response = await applicationsStore.sendApplication({
    message: values.message,
    tableId: props.table?.id,
  });
  if (response) {
    apiError.value = response;
    return;
  }
  emits('updateExisting');
  emits('close');
});
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="modal justify-center p-3">
      <div ref="cardRef" class="card-primary gap-3">
        <h1 class="font-semibold uppercase">{{ table?.title }}</h1>
        <FormTextarea
          :name="formFields.message.name"
          :label="$t(formFields.message.label)"
          :placeholder="$t(formFields.message.placeholder)"
          v-model="messageValue"
          :maxlength="APPLICATION_MESSAGE_MAX_LENGTH"
          :rows="7"
          :disabled="sendingApplication"
          :error="errors.message"
        >
          <template #field-icon><NuxtIcon name="apply" /></template>
        </FormTextarea>
        <button @click.prevent="onSubmit" class="btn-accent mt-3" :disabled="sendingApplication">
          {{ $t('tables-apply.submit') }}
        </button>
      </div>
    </div>
  </Transition>
</template>
