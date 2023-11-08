<script setup lang="ts">
import { object, string } from 'zod'
import { useField, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { AcceptMessage, Table, TableUpdateBody } from '@rpg-together/models'
import {
  DEFAULT_TABLE_BANNER,
  TABLE_ACCEPT_MESSAGE_MAX_LENGTH,
  TABLE_DESCRIPTION_MAX_LENGTH,
  TABLE_TITLE_MAX_LENGTH,
} from '@rpg-together/utilities'
import { SnackType } from '~/types'
import { useSnackbarStore, useTablesStore } from '~/stores'

definePageMeta({ middleware: ['logged-in'] })
useHead({ title: useNuxtApp().$i18n.t('edit-table.title') })

const tableId = useRoute().params.id as string
const localeRoute = useLocaleRoute()
const tablesStore = useTablesStore()
const { updatingTable } = storeToRefs(tablesStore)

const table = ref<Table>()
const acceptMessage = ref<AcceptMessage>()
const showDiscardChangedDialogs = ref(false)
const blockedPath = ref('')
const confirmExit = ref(false)
const apiError = ref('')
const bannerImageFile = ref<File>()

const formFields = {
  'title': {
    name: 'title',
    label: 'edit-table.form.title.label',
    placeholder: 'edit-table.form.title.placeholder',
  },
  'description': {
    name: 'description',
    label: 'edit-table.form.description.label',
    placeholder: 'edit-table.form.description.placeholder',
  },
  'banner-url': {
    name: 'banner-url',
    label: 'edit-table.form.banner-url.label',
    placeholder: 'edit-table.form.banner-url.placeholder',
  },
  'flairs': {
    name: 'flairs',
    label: 'edit-table.form.flairs.label',
    placeholder: 'edit-table.form.flairs.placeholder',
  },
  'accept-message': {
    name: 'accept-message',
    label: 'edit-table.form.accept-message.label',
    placeholder: 'edit-table.form.accept-message.placeholder',
  },
}

const formSchema = object({
  'title': string().min(3).max(TABLE_TITLE_MAX_LENGTH),
  'description': string().min(3).max(TABLE_DESCRIPTION_MAX_LENGTH),
  'banner-url': string().optional(),
  'flairs': string().array().optional(),
  'accept-message': string().min(3).max(TABLE_ACCEPT_MESSAGE_MAX_LENGTH),
})

const { errors, handleSubmit, setValues } = useForm({ validationSchema: toTypedSchema(formSchema) })
const { value: titleValue } = useField<string>(formFields.title.name)
const { value: descriptionValue } = useField<string>(formFields.description.name)
const { value: bannerUrlValue } = useField<string>(formFields['banner-url'].name)
const { value: flairsValue } = useField<string[]>(formFields.flairs.name)
const { value: acceptMessageValue } = useField<string>(formFields['accept-message'].name)

const thereAreChanges = computed(() => {
  const oldData: TableUpdateBody = {
    title: table.value?.title,
    description: table.value?.description,
    flairs: table.value?.flairs,
    acceptMessage: acceptMessage.value?.message,
  }
  const newData: TableUpdateBody = {
    title: titleValue.value,
    description: descriptionValue.value,
    flairs: flairsValue.value,
    acceptMessage: acceptMessageValue.value,
  }
  return bannerImageFile.value ? true : JSON.stringify(oldData) !== JSON.stringify(newData)
})

async function onUserAvatarFileUploaded(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length)
    return

  bannerImageFile.value = files[0]
  bannerUrlValue.value = URL.createObjectURL(bannerImageFile.value)
}

function updateFlairs(values: string[]) {
  if (updatingTable.value)
    return

  flairsValue.value = values
}

const onSubmit = handleSubmit(async (values) => {
  apiError.value = ''
  const response = await tablesStore.updateTable(
    tableId,
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
  else
    confirmExit.value = true
  navigateTo(localeRoute({ name: 'my-tables' }))
})

function forcedExit() {
  confirmExit.value = true
  navigateTo(localeRoute({ path: blockedPath.value }))
}

useRouter().beforeEach((to, _from) => {
  if (thereAreChanges.value && !confirmExit.value) {
    blockedPath.value = to.fullPath
    showDiscardChangedDialogs.value = true
    return false
  }
})

onMounted(async () => {
  table.value = await tablesStore.getTable(tableId)
  acceptMessage.value = await useRpgTogetherAPI.getTableAcceptMessage({ tableId: table.value?.id ?? '' })
  if (!table) {
    useSnackbarStore().createSnack({ type: SnackType.ERROR, message: 'edit-table.table-not-found' })
    return navigateTo(localeRoute({ name: 'my-tables' }))
  }
  setValues({
    'title': table.value?.title,
    'description': table.value?.description,
    'banner-url': table.value?.banner,
    'flairs': table.value?.flairs,
    'accept-message': acceptMessage.value.message,
  })
})
</script>

<template>
  <LoadingIcon v-if="!table" />
  <div v-else class="flex flex-col gap-4 h-full pb-3 overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('edit-table.title')" back="my-tables" />
    <div class="flex flex-col gap-4 px-2">
      <FormInput
        v-model="titleValue"
        :name="formFields.title.name"
        :label="$t(formFields.title.label)"
        :placeholder="$t(formFields.title.placeholder)"
        :maxlength="128"
        autocomplete="off"
        :disabled="updatingTable"
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
        :disabled="updatingTable"
        :error="errors.description"
      >
        <template #field-icon>
          <NuxtIcon name="document" />
        </template>
      </FormTextarea>
      <div class="flex flex-col gap-2">
        <h1>{{ $t(formFields['banner-url'].label) }}</h1>
        <div class="flex flex-col w-full">
          <input
            id="banner"
            type="file"
            name="banner"
            accept="image/*"
            :disabled="updatingTable"
            hidden
            @change="onUserAvatarFileUploaded"
          >
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
      <FlairsMenu :open="!updatingTable" :initial-flairs="table?.flairs" @change="updateFlairs" />
      <FormTextarea
        v-model="acceptMessageValue"
        :name="formFields['accept-message'].name"
        :label="$t(formFields['accept-message'].label)"
        :placeholder="$t(formFields['accept-message'].placeholder)"
        :maxlength="TABLE_ACCEPT_MESSAGE_MAX_LENGTH"
        :rows="7"
        :disabled="updatingTable"
        :error="errors['accept-message']"
      >
        <template #field-icon>
          <NuxtIcon name="send" />
        </template>
      </FormTextarea>
      <LoadingCard v-if="updatingTable" />
      <div v-else class="flex flex-col gap-3">
        <button class="btn-accent" :disabled="updatingTable" @click.prevent="onSubmit">
          {{ $t('edit-table.submit') }}
        </button>
        <span v-if="apiError" class="relative px-2 py-1 self-end text-sm bg-danger rounded">
          <p>{{ apiError }}</p>
          <div class="absolute bottom-full error-message-arrow-up" />
        </span>
      </div>
    </div>
    <DiscardChangesDialog :show="showDiscardChangedDialogs" @close="showDiscardChangedDialogs = false" @confirm="forcedExit" />
  </div>
</template>
