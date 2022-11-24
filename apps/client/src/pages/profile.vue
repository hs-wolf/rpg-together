<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUserStore } from '~/stores';
import { DEFAULT_USER_AVATAR, firebaseTimestampToDate } from '@rpg-together/utils';

definePageMeta({ middleware: ['auth'] });
useHead({ title: useI18n().t('profile.title') });

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="$t('profile.title')" />
    <div class="flex flex-col items-center gap-3 px-3">
      <div class="relative flex justify-center items-center">
        <NuxtImg
          :src="user?.avatar ?? DEFAULT_USER_AVATAR"
          :alt="user?.username"
          width="180"
          height="180"
          sizes="sm:100vw md:50vw lg:50vw"
          format="webp"
          class="w-[50vw] h-[50vw] rounded-full shadow"
        />
        <div class="absolute flex justify-center items-center w-12 h-12 bg-black rounded-full text-xl opacity-50">
          <Icon name="clarity:picture-solid" />
        </div>
      </div>
      <h1 class="text-2xl font-semibold">{{ user?.username }}</h1>
    </div>
    <div class="flex flex-col gap-3 px-3 py-6 text-center">
      <p>
        Email: <span class="text-accent-light font-semibold">{{ user?.email }}</span>
      </p>
      <p class="text-xs">Creation date: {{ firebaseTimestampToDate(user?.creationDate as any) }}</p>
      <p class="text-xs">Last update: {{ firebaseTimestampToDate(user?.lastUpdateDate as any) }}</p>
    </div>
    <div class="flex flex-col p-3 gap-3">
      <button class="btn-secondary">Change email</button>
      <button class="btn-secondary">Change password</button>
      <button class="btn-danger">Delete account</button>
    </div>
  </div>
</template>
