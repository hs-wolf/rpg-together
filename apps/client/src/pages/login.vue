<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUserStore } from '~/stores';

definePageMeta({ middleware: ['logged-out'] });

useHead({ title: useI18n().t('login.title') });

const userStore = useUserStore();
const { signingIn } = storeToRefs(userStore);

const email = ref('');
const password = ref('');
const showPassword = ref(false);
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="$t('login.title')" />
    <div class="flex flex-col gap-6 p-3">
      <div class="flex flex-col gap-3">
        <div class="relative flex items-center border border-primary-light rounded">
          <NuxtIcon name="email" class="absolute left-3 pointer-events-none" />
          <input
            name="email"
            type="text"
            v-model="email"
            placeholder="Email"
            :disabled="signingIn"
            class="w-full h-full pl-[42px] pr-3 py-2 outline-none bg-transparent autofill:bg-transparent"
          />
        </div>
        <div class="relative flex items-center border border-primary-light rounded">
          <NuxtIcon name="key" class="absolute left-3 pointer-events-none" />
          <input
            name="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            :disabled="signingIn"
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
      <LoadingCard v-if="signingIn" />
      <button v-else class="btn-accent" @click.prevent="userStore.signIn(email, password)">{{ $t('login.submit') }}</button>
      <i18n-t keypath="login.no-account" tag="div" scope="global" class="text-center text-sm">
        <NuxtLink :to="{ name: 'register' }" class="text-accent font-medium">{{ $t('login.register-here') }}</NuxtLink>
      </i18n-t>
    </div>
  </div>
</template>
