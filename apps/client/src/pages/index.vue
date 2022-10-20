<script setup lang="ts">
import { useI18n } from 'vue-i18n';

useHead({ title: useI18n().t('home.title') });
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-center items-center gap-2 h-24 p-3 pb-0 text-xl text-accent tracking-widest font-semibold">
      <nuxt-icon name="logo" />
      <p>{{ $t('home.title') }}</p>
    </div>
    <home-featured />
    <home-announcements />
  </div>
</template>
