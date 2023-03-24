<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUserStore } from '~/stores';
import { DEFAULT_USER_AVATAR, firebaseTimestampToDate } from '@rpg-together/utils';

definePageMeta({ middleware: ['logged-in'] });
useHead({ title: useI18n().t('profile.title') });

const userStore = useUserStore();
const { user, changingAvatar } = storeToRefs(userStore);

const userAvatarImageFile = ref<File>();
const userAvatarImageUrl = ref('');
const onUserAvatarFileUploaded = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files?.length) {
    return;
  }
  userAvatarImageFile.value = files[0];
  userAvatarImageUrl.value = URL.createObjectURL(userAvatarImageFile.value);
  userStore.changeAvatar(userAvatarImageFile.value);
};

const showChangeUsernameModal = ref(false);
const showChangeEmailModal = ref(false);
const showChangePasswordModal = ref(false);
const showDeleteAccountModal = ref(false);

const currentAvatarUrl = computed(() =>
  userAvatarImageUrl.value.length
    ? userAvatarImageUrl.value
    : user.value?.avatar.length
    ? user.value?.avatar
    : DEFAULT_USER_AVATAR
);
</script>

<template>
  <div class="flex flex-col h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('profile.title')" />
    <div class="flex flex-col items-center gap-3 px-3">
      <input
        type="file"
        name="userAvatar"
        id="userAvatar"
        @change="onUserAvatarFileUploaded"
        :disabled="changingAvatar"
        hidden
      />
      <label for="userAvatar" class="flex justify-center items-center transition-transform active:scale-90 cursor-pointer">
        <NuxtImg
          :src="currentAvatarUrl"
          :alt="user?.username"
          width="180"
          height="180"
          sizes="sm:100vw md:50vw lg:50vw"
          format="webp"
          class="w-[50vw] h-[50vw] rounded-full shadow object-cover"
        />
        <div class="absolute flex justify-center items-center w-12 h-12 bg-black rounded-full text-xl opacity-50">
          <NuxtIcon :name="changingAvatar ? 'loading-loop' : 'picture'" />
        </div>
      </label>
      <div class="flex flex-wrap justify-center items-center gap-2">
        <h1 class="text-2xl font-semibold">{{ user?.username }}</h1>
        <button class="transition-transform active:scale-90" @click.prevent="showChangeUsernameModal = true">
          <NuxtIcon name="edit-pencil" class="text-xl" />
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-3 px-3 py-6 text-center">
      <div class="flex flex-wrap justify-center items-center gap-2">
        <p>{{ $t('profile.email') }}</p>
        <p class="text-accent-light font-semibold break-all">{{ user?.email }}</p>
        <button class="transition-transform active:scale-90" @click.prevent="showChangeEmailModal = true">
          <NuxtIcon name="edit-pencil" class="text-xl" />
        </button>
      </div>
      <p class="text-xs">{{ $t('profile.creation-date', { date: firebaseTimestampToDate(user?.creationDate as any) }) }}</p>
      <p class="text-xs">
        {{ $t('profile.last-update-date', { date: firebaseTimestampToDate(user?.lastUpdateDate as any) }) }}
      </p>
    </div>
    <div class="flex flex-col p-3 gap-3">
      <button class="btn-secondary" @click.prevent="showChangePasswordModal = true">{{ $t('profile.change-password') }}</button>
      <button class="btn-danger self-end" @click.prevent="showDeleteAccountModal = true">
        {{ $t('profile.delete-account') }}
      </button>
    </div>
    <TransitionGroup name="fade" tag="div">
      <ProfileChangeUsernameModal :user="user" v-if="showChangeUsernameModal" @close="showChangeUsernameModal = false" />
      <ProfileChangeEmailModal :user="user" v-if="showChangeEmailModal" @close="showChangeEmailModal = false" />
      <ProfileChangePasswordModal :user="user" v-if="showChangePasswordModal" @close="showChangePasswordModal = false" />
      <ProfileDeleteAccountModal :user="user" v-if="showDeleteAccountModal" @close="showDeleteAccountModal = false" />
    </TransitionGroup>
  </div>
</template>
