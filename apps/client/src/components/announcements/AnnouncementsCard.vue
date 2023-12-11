<script setup lang="ts">
import type { Announcement, SupportedLanguages } from '@rpg-together/models'
import { formatDateSimple } from '@rpg-together/utilities'

defineProps<{ announcement: Announcement }>()
</script>

<template>
  <div class="relative flex flex-col gap-3 bg-primary-1 rounded-sm">
    <div class="z-20 flex flex-col gap-3 p-3 lg:p-5">
      <span class="text-xs lg:text-sm text-secondary-2/80">{{ formatDateSimple(announcement.creationDate, $i18n.locale) }}</span>
      <h1 class="text-lg lg:text-xl text-accent-2 font-semibold">
        {{ announcement.title[$i18n.locale as SupportedLanguages] }}
      </h1>
      <p class="text-sm lg:text-base whitespace-pre-line">
        {{ announcement.message[$i18n.locale as SupportedLanguages] }}
      </p>
    </div>
    <NuxtImg
      v-if="announcement.image"
      :src="announcement.image"
      :alt="announcement.title[$i18n.locale as SupportedLanguages]"
      width="512"
      height="512"
      class="lg:hidden w-full h-[128px] lg:h-[192px] rounded-b-sm object-cover opacity-60"
    />
    <div class="z-10 absolute hidden lg:block w-full h-full">
      <NuxtImg
        v-if="announcement.image"
        :src="announcement.image"
        :alt="announcement.title[$i18n.locale as SupportedLanguages]"
        width="512"
        height="512"
        class="w-full h-full rounded-b-sm object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-l from-primary/60 via-primary-1 to-primary-1" />
    </div>
  </div>
</template>
