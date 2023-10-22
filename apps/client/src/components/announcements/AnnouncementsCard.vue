<script setup lang="ts">
import type { Announcement, SupportedLanguages } from '@rpg-together/models'
import { formatDateSimple } from '@rpg-together/utilities'

defineProps<{ announcement: Announcement }>()
</script>

<template>
  <div class="flex flex-col gap-2 bg-primary-dark shadow shadow-primary-dark rounded-sm">
    <div class="flex flex-col gap-2 p-2">
      <span class="text-sm opacity-50">{{ formatDateSimple(announcement.creationDate, $i18n.locale) }}</span>
      <h1 class="text-lg text-accent font-semibold">
        {{ announcement.title[$i18n.locale as SupportedLanguages] }}
      </h1>
      <p class="text-sm whitespace-pre-line">
        {{ announcement.message[$i18n.locale as SupportedLanguages] }}
      </p>
    </div>
    <NuxtImg
      v-if="announcement.image"
      :src="announcement.image"
      :alt="announcement.title[$i18n.locale as SupportedLanguages]"
      class="max-h-[128px] min-h-[128px] rounded-b-sm object-cover"
    />
  </div>
</template>
