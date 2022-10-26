<script setup lang="ts">
import { useI18n } from 'vue-i18n';

useHead({ title: useI18n().t('announcements.title') });
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="$t('announcements.title')" />
  </div>
</template>
