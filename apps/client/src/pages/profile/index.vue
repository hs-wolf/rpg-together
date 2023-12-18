<script setup lang="ts">
import { DEFAULT_USER_AVATAR } from '@rpg-together/utilities'
import { useUserStore } from '~/stores'

const { t, locale } = useNuxtApp().$i18n
const userStore = useUserStore()
const { user, changingAvatar } = storeToRefs(userStore)

const userAvatarImageFile = ref<File>()
const userAvatarImageUrl = ref('')
async function onUserAvatarFileUploaded(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files?.length)
    return

  userAvatarImageFile.value = files[0]
  userAvatarImageUrl.value = URL.createObjectURL(userAvatarImageFile.value)
  userStore.changeAvatar(userAvatarImageFile.value)
}

const showChangeUsernameModal = ref(false)
const showChangeEmailModal = ref(false)
const showChangePasswordModal = ref(false)
const showDeleteAccountModal = ref(false)

const currentAvatarUrl = computed(() =>
  userAvatarImageUrl.value.length
    ? userAvatarImageUrl.value
    : user.value?.avatar.length
      ? user.value?.avatar
      : DEFAULT_USER_AVATAR,
)

definePageMeta({ middleware: ['logged-in'] })

useHead({ title: computed(() => t('pages.profile.title', { name: user.value?.username ?? '...' })) })
</script>

<template>
  <div class="flex flex-col gap-5 lg:pt-9 lg:gap-9">
    <PageTitle :title="$t('pages.profile.title')" />
    <div class="flex flex-col gap-3 w-full px-3 lg:grid lg:grid-cols-2 lg:px-0 lg:gap-5 lg:max-w-5xl lg:mx-auto">
      <div class="flex flex-col items-center lg:items-start gap-3 lg:gap-5">
        <input
          id="userAvatar"
          type="file"
          name="userAvatar"
          :disabled="changingAvatar"
          hidden
          @change="onUserAvatarFileUploaded"
        >
        <label for="userAvatar" class="relative flex justify-center items-center transition-transform active:scale-90 cursor-pointer">
          <NuxtImg
            :src="currentAvatarUrl"
            :alt="user?.username"
            width="180"
            height="180"
            class="w-[192px] lg:w-[256px] aspect-square rounded-sm shadow object-cover"
          />
          <div class="absolute flex justify-center items-center w-12 h-12 bg-black rounded-full text-xl opacity-50 lg:w-16 lg:h-16 lg:text-3xl">
            <NuxtIcon :name="changingAvatar ? 'loading-loop' : 'picture'" filled />
          </div>
        </label>
        <div class="flex justify-center items-center gap-2 lg:gap-3">
          <button class="transition-transform active:scale-90" @click.prevent="showChangeUsernameModal = true">
            <NuxtIcon name="edit-pencil" class="text-xl lg:text-2xl" />
          </button>
          <h1 class="text-2xl lg:text-3xl font-semibold">
            {{ user?.username }}
          </h1>
        </div>
      </div>
      <div class="flex flex-col gap-5 lg:gap-7">
        <div class="flex flex-col gap-2 lg:gap-3 text-center lg:text-start">
          <div class="flex flex-wrap justify-center lg:justify-start items-center gap-2 lg:text-lg">
            <button class="transition-transform active:scale-90" @click.prevent="showChangeEmailModal = true">
              <NuxtIcon name="edit-pencil" class="text-xl lg:text-2xl" />
            </button>
            <p>{{ $t('pages.profile.email') }}</p>
            <p class="text-accent-1 font-semibold break-all">
              {{ user?.email }}
            </p>
          </div>
          <p class="text-xs lg:text-sm">
            {{ $t('pages.profile.creation-date', { date: user?.creationDate.toLocaleString(locale) }) }}
          </p>
          <p class="text-xs lg:text-sm">
            {{ $t('pages.profile.last-update-date', { date: user?.lastUpdateDate.toLocaleString(locale) }) }}
          </p>
        </div>
        <div class="flex flex-col gap-3 lg:gap-5">
          <button class="btn btn-secondary self-center lg:w-auto lg:self-start" @click.prevent="showChangePasswordModal = true">
            {{ $t('pages.profile.change-password') }}
          </button>
          <button class="btn btn-danger self-center lg:w-auto lg:self-start" @click.prevent="showDeleteAccountModal = true">
            {{ $t('pages.profile.delete-account') }}
          </button>
        </div>
      </div>
    </div>
    <TransitionGroup name="fade" tag="div">
      <ProfileChangeUsernameModal v-if="showChangeUsernameModal" :user="user" @close="showChangeUsernameModal = false" />
      <ProfileChangeEmailModal v-if="showChangeEmailModal" :user="user" @close="showChangeEmailModal = false" />
      <ProfileChangePasswordModal v-if="showChangePasswordModal" :user="user" @close="showChangePasswordModal = false" />
      <ProfileDeleteAccountModal v-if="showDeleteAccountModal" :user="user" @close="showDeleteAccountModal = false" />
    </TransitionGroup>
  </div>
</template>
