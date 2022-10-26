<script setup lang="ts">
import { useI18n } from 'vue-i18n';

definePageMeta({ middleware: ['auth'] });

useHead({ title: useI18n().t('profile.title') });
</script>

<template>
  <div class="flex flex-col">
    <PageTitle :title="$t('profile.title')" />
  </div>
</template>
