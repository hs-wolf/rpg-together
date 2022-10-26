<script setup lang="ts">
import { useI18n } from 'vue-i18n';

useHead({ title: useI18n().t('my-applications.title') });
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="$t('my-applications.title')" />
  </div>
</template>
