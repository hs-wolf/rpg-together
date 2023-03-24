<script setup lang="ts">
import { object, string } from 'zod';
import { useForm, useField } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';
import { useI18n } from 'vue-i18n';
import { useTablesStore } from '~/stores';
import { DEFAULT_TABLE_BANNER } from '@rpg-together/utils';

definePageMeta({ middleware: ['logged-in'] });
useHead({ title: useI18n().t('create-table.title') });

const tablesStore = useTablesStore();
const { creatingTable } = storeToRefs(tablesStore);

const formFields = {
  title: {
    name: 'title',
    label: 'create-table.form.title.label',
    placeholder: 'create-table.form.title.placeholder',
  },
  description: {
    name: 'description',
    label: 'create-table.form.description.label',
    placeholder: 'create-table.form.description.placeholder',
  },
  ['banner-url']: {
    name: 'banner-url',
    label: 'create-table.form.banner-url.label',
    placeholder: 'create-table.form.banner-url.placeholder',
  },
  flairs: {
    name: 'flairs',
    label: 'create-table.form.flairs.label',
    placeholder: 'create-table.form.flairs.placeholder',
  },
  ['accept-message']: {
    name: 'accept-message',
    label: 'create-table.form.accept-message.label',
    placeholder: 'create-table.form.accept-message.placeholder',
  },
};
const formSchema = object({
  title: string().min(3).max(128),
  description: string().min(3).max(512),
  ['banner-url']: string().optional(),
  flairs: string().array().optional(),
  ['accept-message']: string().min(3).max(512),
});

const { errors, handleSubmit } = useForm({ validationSchema: toFormValidator(formSchema) });
const { value: titleValue } = useField<string>(formFields.title.name);
const { value: descriptionValue } = useField<string>(formFields.description.name);
const { value: bannerUrlValue } = useField<string>(formFields['banner-url'].name);
const { value: flairsValue } = useField<string[]>(formFields.flairs.name);
const { value: acceptMessageValue } = useField<string>(formFields['accept-message'].name);
const apiError = ref('');

const bannerImageFile = ref<File>();
const onUserAvatarFileUploaded = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files?.length) {
    return;
  }
  bannerImageFile.value = files[0];
  bannerUrlValue.value = URL.createObjectURL(bannerImageFile.value);
};

const updateFlairs = (values: string[]) => {
  if (creatingTable.value) {
    return;
  }
  flairsValue.value = values;
};

const onSubmit = handleSubmit(async (values) => {
  apiError.value = '';
  const response = await tablesStore.createTable(
    {
      title: values.title,
      description: values.description,
      flairs: values.flairs,
      acceptMessage: values['accept-message'],
    },
    bannerImageFile.value
  );
  if (response) {
    apiError.value = response;
  }
});
</script>

<template>
  <div class="flex flex-col h-full pb-3 overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('create-table.title')" back="my-tables" />
    <div class="flex flex-col gap-6 px-3">
      <FormInput
        :name="formFields.title.name"
        :label="$t(formFields.title.label)"
        :placeholder="$t(formFields.title.placeholder)"
        v-model="titleValue"
        :maxlength="128"
        autocomplete="off"
        :disabled="creatingTable"
        :error="errors.title"
      >
        <template #field-icon><NuxtIcon name="title" /></template>
      </FormInput>
      <FormTextarea
        :name="formFields.description.name"
        :label="$t(formFields.description.label)"
        :placeholder="$t(formFields.description.placeholder)"
        v-model="descriptionValue"
        :maxlength="512"
        :rows="7"
        :disabled="creatingTable"
        :error="errors.description"
      >
        <template #field-icon><NuxtIcon name="document" /></template>
      </FormTextarea>
      <div class="flex flex-col gap-2">
        <h1>{{ $t(formFields['banner-url'].label) }}</h1>
        <div class="flex flex-col w-full">
          <input
            id="banner"
            type="file"
            name="banner"
            accept="image/*"
            @change="onUserAvatarFileUploaded"
            :disabled="creatingTable"
            hidden
          />
          <label
            for="banner"
            class="relative flex justify-center items-center transition-transform active:scale-90 cursor-pointer"
          >
            <NuxtImg
              :src="bannerUrlValue ?? DEFAULT_TABLE_BANNER"
              :alt="$t(formFields['banner-url'].label)"
              width="128"
              height="128"
              sizes="sm:100vw md:50vw lg:400px"
              format="webp"
              class="w-full h-32 shadow rounded opacity-80 object-cover"
            />
            <div class="absolute flex justify-center items-center w-12 h-12 bg-black rounded-full text-xl opacity-80">
              <NuxtIcon name="picture" filled />
            </div>
          </label>
        </div>
      </div>
      <FlairsMenu :open="!creatingTable" @change="updateFlairs" />
      <FormTextarea
        :name="formFields['accept-message'].name"
        :label="$t(formFields['accept-message'].label)"
        :placeholder="$t(formFields['accept-message'].placeholder)"
        v-model="acceptMessageValue"
        :maxlength="512"
        :rows="7"
        :disabled="creatingTable"
        :error="errors['accept-message']"
      >
        <template #field-icon><NuxtIcon name="send" /></template>
      </FormTextarea>
      <LoadingCard v-if="creatingTable" />
      <div v-else class="flex flex-col gap-3">
        <button class="btn-accent" :disabled="creatingTable" @click.prevent="onSubmit">
          {{ $t('create-table.submit') }}
        </button>
        <span v-if="apiError" class="relative px-2 py-1 self-end text-sm bg-danger rounded">
          <p>{{ apiError }}</p>
          <div class="absolute bottom-full error-message-arrow-up"></div>
        </span>
      </div>
    </div>
  </div>
</template>
