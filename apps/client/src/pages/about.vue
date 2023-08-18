<script setup lang="ts">
import { useI18n } from 'vue-i18n';

useHead({ title: useI18n().t('about.title') });
</script>

<template>
  <div class="flex flex-col h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('about.title')" />
    <div class="flex flex-col gap-1 p-3">
      <h1 class="text-xl font-semibold">{{ $t('about.who-we-are') }}</h1>
      <p>{{ $t('about.who-we-are-text') }}</p>
    </div>
    <div class="flex flex-col gap-1 p-3">
      <h1 class="text-xl font-semibold">{{ $t('about.our-mission') }}</h1>
      <p>{{ $t('about.our-mission-text') }}</p>
    </div>
  </div>
</template>
