<script setup lang="ts">
useHead({ title: useNuxtApp().$i18n.t('about.title') })
</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('about.title')" />
    <div class="flex flex-col gap-2 px-2">
      <h1 class="text-xl font-semibold">
        {{ $t('about.who-we-are') }}
      </h1>
      <p>{{ $t('about.who-we-are-text') }}</p>
    </div>
    <div class="flex flex-col gap-2 px-2">
      <h1 class="text-xl font-semibold">
        {{ $t('about.our-mission') }}
      </h1>
      <p>{{ $t('about.our-mission-text') }}</p>
    </div>
  </div>
</template>
