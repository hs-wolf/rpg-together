<script setup lang="ts">
import type { Announcement } from '@rpg-together/models'
import { useAnnouncementsStore } from '~/stores'

const localePath = useLocalePath()
const announcementsStore = useAnnouncementsStore()

const announcements = ref<Announcement[]>()

onMounted(async () => {
  announcements.value = await announcementsStore.getAnnouncements(2)
})
</script>

<template>
  <div class="flex flex-col gap-3 w-full px-3 lg:px-0 lg:gap-5 lg:max-w-5xl lg:mx-auto">
    <div class="flex items-center gap-2 font-semibold text-lg lg:text-xl">
      <NuxtIcon name="pin" />
      <h1>{{ $t('home-announcements.title') }}</h1>
    </div>
    <div v-if="announcements?.length" class="flex flex-col gap-4">
      <AnnouncementsCard v-for="announcement in announcements" :key="announcement.id" :announcement="announcement" />
      <NuxtLink :to="localePath({ name: 'announcements' })" class="btn-accent">
        {{ $t('home-announcements.see-all') }}
      </NuxtLink>
    </div>
    <LoadingCard v-else />
  </div>
</template>
