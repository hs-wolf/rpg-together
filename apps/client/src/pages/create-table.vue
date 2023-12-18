<script setup lang="ts">
import { object, string } from 'zod'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import {
  DEFAULT_TABLE_BANNER,
  TABLE_ACCEPT_MESSAGE_MAX_LENGTH,
  TABLE_DESCRIPTION_MAX_LENGTH,
  TABLE_TITLE_MAX_LENGTH,
} from '@rpg-together/utilities'
import { useTablesStore } from '~/stores'

const { t } = useNuxtApp().$i18n
const tablesStore = useTablesStore()
const { creatingTable } = storeToRefs(tablesStore)

const formFields = {
  'title': {
    name: 'title',
    label: 'pages.create-table.form.title.label',
    placeholder: 'pages.create-table.form.title.placeholder',
  },
  'description': {
    name: 'description',
    label: 'pages.create-table.form.description.label',
    placeholder: 'pages.create-table.form.description.placeholder',
  },
  'banner-url': {
    name: 'banner-url',
    label: 'pages.create-table.form.banner-url.label',
    placeholder: 'pages.create-table.form.banner-url.placeholder',
  },
  'flairs': {
    name: 'flairs',
    label: 'pages.create-table.form.flairs.label',
    placeholder: 'pages.create-table.form.flairs.placeholder',
  },
  'accept-message': {
    name: 'accept-message',
    label: 'pages.create-table.form.accept-message.label',
    placeholder: 'pages.create-table.form.accept-message.placeholder',
  },
}
const formSchema = object({
  'title': string().min(3).max(TABLE_TITLE_MAX_LENGTH),
  'description': string().min(3).max(TABLE_DESCRIPTION_MAX_LENGTH),
  'banner-url': string().optional(),
  'flairs': string().array().optional(),
  'accept-message': string().min(3).max(TABLE_ACCEPT_MESSAGE_MAX_LENGTH),
})

const { errors, handleSubmit } = useForm({ validationSchema: toTypedSchema(formSchema) })
const { value: titleValue } = useField<string>(formFields.title.name)
const { value: descriptionValue } = useField<string>(formFields.description.name)
const { value: bannerUrlValue } = useField<string>(formFields['banner-url'].name)
const { value: flairsValue } = useField<string[]>(formFields.flairs.name)
const { value: acceptMessageValue } = useField<string>(formFields['accept-message'].name)
const apiError = ref<string>()

const bannerImageFile = ref<File>()
async function onUserAvatarFileUploaded(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length)
    return

  bannerImageFile.value = files[0]
  bannerUrlValue.value = URL.createObjectURL(bannerImageFile.value)
}

function updateFlairs(values: string[]) {
  if (creatingTable.value)
    return

  flairsValue.value = values
}

const onSubmit = handleSubmit(async (values) => {
  apiError.value = ''
  const response = await tablesStore.createTable(
    {
      title: values.title,
      description: values.description,
      flairs: values.flairs,
      acceptMessage: values['accept-message'],
    },
    bannerImageFile.value,
  )
  if (response)
    apiError.value = response
})

definePageMeta({ middleware: ['logged-in'] })

useHead({ title: t('pages.create-table.title') })
</script>

<template>
  <div class="flex flex-col gap-5 lg:pt-9 lg:gap-9">
    <PageTitle :title="$t('pages.create-table.title')" back="my-tables" />
    <h1 class="w-full px-2 lg:px-0 lg:max-w-xl lg:mx-auto text-lg lg:text-xl font-semibold">
      {{ $t('pages.create-table.title') }}
    </h1>
    <div class="flex flex-col gap-3 lg:gap-5 px-2 lg:px-0 w-full lg:max-w-xl lg:mx-auto">
      <FormInput
        v-model="titleValue"
        :name="formFields.title.name"
        :label="$t(formFields.title.label)"
        :placeholder="$t(formFields.title.placeholder)"
        :maxlength="128"
        autocomplete="off"
        :disabled="creatingTable"
        :error="errors.title"
      >
        <template #field-icon>
          <NuxtIcon name="title" />
        </template>
      </FormInput>
      <FormTextarea
        v-model="descriptionValue"
        :name="formFields.description.name"
        :label="$t(formFields.description.label)"
        :placeholder="$t(formFields.description.placeholder)"
        :maxlength="TABLE_DESCRIPTION_MAX_LENGTH"
        :rows="7"
        :disabled="creatingTable"
        :error="errors.description"
      >
        <template #field-icon>
          <NuxtIcon name="document" />
        </template>
      </FormTextarea>
      <div class="flex flex-col gap-2 lg:gap-3">
        <h1 class="lg:text-lg">
          {{ $t(formFields['banner-url'].label) }}
        </h1>
        <div class="flex flex-col w-full">
          <input
            id="banner"
            type="file"
            name="banner"
            accept="image/*"
            :disabled="creatingTable"
            hidden
            @change="onUserAvatarFileUploaded"
          >
          <label
            for="banner"
            class="btn-effect relative flex justify-center items-center"
          >
            <NuxtImg
              :src="bannerUrlValue ?? DEFAULT_TABLE_BANNER"
              :alt="$t(formFields['banner-url'].label)"
              width="256"
              height="256"
              format="webp"
              class="w-full h-48 lg:h-64 shadow rounded opacity-80 object-cover"
            />
            <div class="absolute flex justify-center items-center w-12 h-12 bg-black rounded-full text-xl opacity-80">
              <NuxtIcon name="picture" filled />
            </div>
          </label>
        </div>
      </div>
      <FlairsMenu v-model="flairsValue" :open="!creatingTable" @change="updateFlairs" />
      <FormTextarea
        v-model="acceptMessageValue"
        :name="formFields['accept-message'].name"
        :label="$t(formFields['accept-message'].label)"
        :placeholder="$t(formFields['accept-message'].placeholder)"
        :maxlength="TABLE_ACCEPT_MESSAGE_MAX_LENGTH"
        :rows="7"
        :disabled="creatingTable"
        :error="errors['accept-message']"
      >
        <template #field-icon>
          <NuxtIcon name="send" />
        </template>
      </FormTextarea>
      <LoadingCard v-if="creatingTable" />
      <div v-else class="flex flex-col gap-2 lg:gap-3 mt-2 lg:mt-3">
        <button class="btn btn-action" :disabled="creatingTable" @click.prevent="onSubmit">
          {{ $t('pages.create-table.submit') }}
        </button>
        <span v-if="apiError" class="relative px-2 py-1 self-end text-sm bg-danger rounded">
          <p>{{ apiError }}</p>
          <div class="absolute bottom-full error-message-arrow-up" />
        </span>
      </div>
    </div>
  </div>
</template>
