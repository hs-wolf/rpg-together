<script setup lang="ts">
import { useI18n } from 'vue-i18n';

useHead({ title: useI18n().t('profile.title') });
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-center items-center gap-2 h-[64px] p-3 text-xl text-accent tracking-widest font-semibold">
      <nuxt-icon name="logo" />
      <p>{{ $t('profile.title') }}</p>
    </div>
  </div>
</template>
