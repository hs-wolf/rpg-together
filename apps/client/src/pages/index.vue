<script setup lang="ts">
const { t } = useNuxtApp().$i18n

useHead({ title: t('pages.home.title') })
</script>

<template>
  <div class="flex flex-col gap-5 lg:pt-9 lg:gap-9">
    <PageTitle :title="$t('pages.home.title')" />
    <HomeFeatured />
    <HomeAnnouncements />
  </div>
</template>
