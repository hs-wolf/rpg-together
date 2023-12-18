<script setup lang="ts">
import type { Announcement } from '@rpg-together/models'
import { useAnnouncementsStore } from '~/stores'

const { t } = useNuxtApp().$i18n
const announcementsStore = useAnnouncementsStore()

const announcements = ref<Announcement[]>()
const madeFirstSearch = ref(false)

useHead({ title: t('pages.announcements.title') })

onMounted(async () => {
  announcements.value = await announcementsStore.getAnnouncements()
  madeFirstSearch.value = true
})
</script>

<template>
  <div class="flex flex-col gap-5 lg:pt-9 lg:gap-9">
    <PageTitle :title="$t('pages.announcements.title')" />
    <div class="flex flex-col w-full px-2 lg:px-0 lg:max-w-5xl lg:mx-auto">
      <div v-if="announcements?.length" class="flex flex-col gap-4">
        <AnnouncementsCard v-for="announcement in announcements" :key="announcement.id" :announcement="announcement" />
      </div>
      <LoadingCard v-else-if="!madeFirstSearch" />
      <p v-else class="p-5 lg:p-9 bg-primary-1 rounded-sm text-sm lg:text-base text-center text-secondary-2">
        {{ $t('pages.announcements.not-found') }}
      </p>
    </div>
  </div>
</template>
