<script setup lang="ts">
const { t } = useNuxtApp().$i18n

useHead({ title: t('pages.settings.title') })
</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('pages.settings.title')" />
  </div>
</template>
