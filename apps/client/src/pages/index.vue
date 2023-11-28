<script setup lang="ts">
useHead({ title: useNuxtApp().$i18n.t('home.title') })
</script>

<template>
  <div class="flex flex-col gap-5 lg:gap-7">
    <PageTitle :title="$t('home.title')" />
    <HomeFeatured />
    <HomeAnnouncements />
  </div>
</template>
