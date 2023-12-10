<script setup lang="ts">
useHead({ title: useNuxtApp().$i18n.t('pages.settings.title') })
</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('pages.settings.title')" />
  </div>
</template>
