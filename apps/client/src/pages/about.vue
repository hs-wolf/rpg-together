<script setup lang="ts">
const { t } = useNuxtApp().$i18n

useHead({ title: t('pages.about.title') })
</script>

<template>
  <div class="flex flex-col gap-5 lg:pt-9 lg:gap-9">
    <PageTitle :title="$t('pages.about.title')" />
    <div class="flex flex-col gap-5 lg:gap-9 w-full px-2 lg:px-0 lg:max-w-5xl lg:mx-auto">
      <div class="flex flex-col gap-2">
        <h1 class="text-xl font-semibold">
          {{ $t('pages.about.who-we-are') }}
        </h1>
        <p>{{ $t('pages.about.who-we-are-text') }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <h1 class="text-xl font-semibold">
          {{ $t('pages.about.our-mission') }}
        </h1>
        <p>{{ $t('pages.about.our-mission-text') }}</p>
      </div>
    </div>
  </div>
</template>
