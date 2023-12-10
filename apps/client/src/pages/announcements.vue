<script setup lang="ts">
import type { Announcement } from '@rpg-together/models'
import { useAnnouncementsStore } from '~/stores'

const announcementsStore = useAnnouncementsStore()

useHead({ title: useNuxtApp().$i18n.t('announcements.title') })

const announcements = ref<Announcement[]>()

onMounted(async () => {
  announcements.value = await announcementsStore.getAnnouncements()
})
</script>

<template>
  <div class="flex flex-col gap-5 lg:gap-7">
    <PageTitle :title="$t('announcements.title')" />
    <div class="flex flex-col w-full px-2 lg:px-0 lg:max-w-5xl lg:mx-auto">
      <div v-if="announcements?.length" class="flex flex-col gap-4">
        <AnnouncementsCard v-for="announcement in announcements" :key="announcement.id" :announcement="announcement" />
      </div>
      <LoadingCard v-else />
    </div>
  </div>
</template>
