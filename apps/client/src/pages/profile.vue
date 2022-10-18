<script setup lang="ts">
import { useI18n } from 'vue-i18n';

useHead({ title: useI18n().t('profile.title') });
</script>

<template>
  <div class="flex flex-col">
    <div class="flex justify-center items-center gap-2 h-[64px] p-3 text-xl text-accent tracking-widest font-semibold">
      <nuxt-icon name="logo" />
      <p>{{ $t('profile.title') }}</p>
    </div>
    <div><nuxt-icon name="filter" class="text-7xl text-accent" /></div>
    <nuxt-img
      src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80"
      alt=""
      loading="lazy"
      format="webp"
      quality="10"
      width="128"
      height="128"
      sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
      class="object-cover w-full h-[128px] shadow rounded"
    />
  </div>
</template>
