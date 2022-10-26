<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/stores';

definePageMeta({ middleware: ['offline'] });

useHead({ title: useI18n().t('register.title') });

const userStore = useUserStore();

const showPassword = ref(false);

const register = () => {
  userStore.register();
};
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="$t('register.title')" />
    <div class="flex flex-col gap-6 p-3">
      <div class="flex flex-col gap-3">
        <div class="relative flex items-center border border-primary-light rounded">
          <NuxtIcon name="user" class="absolute left-0 px-3 py-2 pointer-events-none" />
          <input
            name="username"
            type="text"
            placeholder="Username"
            autocomplete="off"
            class="w-full h-full pl-[42px] pr-3 py-2 outline-none bg-transparent"
          />
        </div>
        <div class="relative flex items-center border border-primary-light rounded">
          <NuxtIcon name="email" class="absolute left-0 px-3 py-2 pointer-events-none" />
          <input
            name="email"
            type="text"
            placeholder="Email"
            autocomplete="off"
            class="w-full h-full pl-[42px] pr-3 py-2 outline-none bg-transparent"
          />
        </div>
        <div class="relative flex items-center border border-primary-light rounded">
          <NuxtIcon name="key" class="absolute left-0 px-3 py-2 pointer-events-none" />
          <input
            name="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            autocomplete="off"
            class="w-full h-full px-[42px] py-2 outline-none bg-transparent"
          />
          <button
            class="absolute right-0 flex px-3 py-2 transition-transform active:scale-90"
            @click.prevent="showPassword = !showPassword"
          >
            <NuxtIcon :name="showPassword ? 'eye-open' : 'eye-closed'" class="text-xl" />
          </button>
        </div>
        <div class="relative flex items-center border border-primary-light rounded">
          <NuxtIcon name="key" class="absolute left-0 px-3 py-2 pointer-events-none" />
          <input
            name="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Repeat password"
            autocomplete="off"
            class="w-full h-full px-[42px] py-2 outline-none bg-transparent"
          />
          <button
            class="absolute right-0 flex px-3 py-2 transition-transform active:scale-90"
            @click.prevent="showPassword = !showPassword"
          >
            <NuxtIcon :name="showPassword ? 'eye-open' : 'eye-closed'" class="text-xl" />
          </button>
        </div>
      </div>
      <button class="btn-accent">{{ $t('register.submit') }}</button>
      <i18n-t keypath="register.existing-account" tag="div" scope="global" class="text-center text-sm">
        <NuxtLink :to="{ name: 'login' }" class="text-accent font-medium">{{ $t('register.login-here') }}</NuxtLink>
      </i18n-t>
    </div>
  </div>
</template>
