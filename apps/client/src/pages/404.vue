<script setup lang="ts">
import { useI18n } from 'vue-i18n';

useHead({ title: useI18n().t('404.title') });
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="$t('404.title')" />
    <div class="flex flex-col gap-6 p-3">
      <h1>Looks like this page doesn´t exist or was removed, oh well, at least you can go back.</h1>
      <NuxtLink to="/" class="btn-accent">Go back</NuxtLink>
    </div>
  </div>
</template>
