<script setup lang="ts">
import { useI18n } from 'vue-i18n'

useHead({ title: useI18n().t('settings.title') })
</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('settings.title')" />
  </div>
</template>
