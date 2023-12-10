<script setup lang="ts">
useHead({ title: useNuxtApp().$i18n.t('pages.home.title') })
</script>

<template>
  <div class="flex flex-col gap-5 lg:gap-7">
    <PageTitle :title="$t('pages.home.title')" />
    <HomeFeatured />
    <HomeAnnouncements />
  </div>
</template>
