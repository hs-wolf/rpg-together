<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

useHead({ title: t('home.title') });
</script>

<template>
  <div class="flex flex-col h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('home.title')" />
    <HomeFeatured />
    <HomeAnnouncements />
  </div>
</template>
