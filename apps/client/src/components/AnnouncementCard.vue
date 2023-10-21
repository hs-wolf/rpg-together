<script setup lang="ts">
import { formatDateSimple } from '@rpg-together/utilities'

// TODO: Change any for the announcement class.
defineProps<{ announcement: any }>()
</script>

<template>
  <div class="flex flex-col gap-2 p-3 bg-primary-dark shadow shadow-primary-dark rounded">
    <span class="text-xs opacity-50">{{ formatDateSimple(announcement.date, $i18n.locale) }}</span>
    <div class="flex flex-col gap-3">
      <h1 class="text-accent font-semibold">
        {{ announcement.title }}
      </h1>
      <p class="text-sm">
        {{ announcement.message }}
      </p>
    </div>
  </div>
</template>
