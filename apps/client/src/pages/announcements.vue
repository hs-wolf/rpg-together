<script setup lang="ts">
import type { Announcement } from '@rpg-together/models'
import { useI18n } from 'vue-i18n'
import { useAnnouncementsStore } from '~/stores'

const announcementsStore = useAnnouncementsStore()

useHead({ title: useI18n().t('announcements.title') })

const announcements = ref<Announcement[]>()

onMounted(async () => {
  announcements.value = await announcementsStore.getAnnouncements()
})
</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="$t('announcements.title')" />
    <div class="flex flex-col px-2">
      <div v-if="announcements?.length" class="flex flex-col gap-4">
        <AnnouncementsCard v-for="announcement in announcements" :key="announcement.id" :announcement="announcement" />
      </div>
      <LoadingCard v-else />
    </div>
  </div>
</template>
