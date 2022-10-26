<script setup lang="ts">
import { useI18n } from 'vue-i18n';

useHead({ title: useI18n().t('home.title') });
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="$t('home.title')" />
    <HomeFeatured />
    <HomeAnnouncements />
  </div>
</template>
