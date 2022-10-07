<script setup lang="ts">
import { useI18n } from 'vue-i18n';

useHead({ title: useI18n().t('search.title') });

const query = ref('');
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex justify-center items-center gap-2 h-[64px] p-3 text-xl text-accent tracking-widest font-semibold">
      <nuxt-icon name="logo" />
      <p>{{ $t('search.title') }}</p>
    </div>
    <div class="relative flex items-center mx-3 border border-secondary rounded">
      <nuxt-icon name="search" class="absolute left-0 px-3 py-2 pointer-events-none" />
      <input type="text" v-model="query" class="w-full h-full px-[42px] py-2 outline-none bg-transparent" />
      <button
        class="absolute right-0 flex px-3 py-2 opacity-50 transition-transform active:rotate-90"
        @click.prevent="query = ''"
      >
        <nuxt-icon name="close" />
      </button>
    </div>
    <i18n-t v-if="query" keypath="search.results-for" tag="h1" class="p-3 text-sm">
      <span class="font-semibold">{{ query }}</span>
    </i18n-t>
  </div>
</template>
