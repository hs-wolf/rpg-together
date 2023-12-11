<script setup lang="ts">
import type { Announcement } from '@rpg-together/models'
import { useAnnouncementsStore } from '~/stores'

const localePath = useLocalePath()
const announcementsStore = useAnnouncementsStore()

const announcements = ref<Announcement[]>()
const madeFirstSearch = ref(false)

onMounted(async () => {
  announcements.value = await announcementsStore.getAnnouncements(2)
  madeFirstSearch.value = true
})
</script>

<template>
  <div class="flex flex-col gap-3 w-full px-3 lg:px-0 lg:gap-5 lg:max-w-5xl lg:mx-auto">
    <div class="flex items-center justify-between">
      <NuxtLink :to="localePath({ name: 'announcements' })" class="btn-effect self-start flex items-center gap-1.5">
        <NuxtIcon name="pin" class="text-xl lg:text-2xl" />
        <h1 class="text-lg lg:text-xl font-semibold">
          {{ $t('components.home.announcements.title') }}
        </h1>
      </NuxtLink>
      <NuxtLink :to="localePath({ name: 'announcements' })" class="btn btn-secondary w-auto hidden lg:flex">
        <p>{{ $t('components.home.announcements.see-all') }}</p>
      </NuxtLink>
    </div>
    <div v-if="announcements?.length" class="flex flex-col gap-5">
      <AnnouncementsCard v-for="announcement in announcements" :key="announcement.id" :announcement="announcement" />
      <NuxtLink :to="localePath({ name: 'announcements' })" class="btn btn-secondary lg:hidden">
        <p>{{ $t('components.home.announcements.see-all') }}</p>
      </NuxtLink>
    </div>
    <LoadingCard v-else-if="!madeFirstSearch" />
    <p v-else class="p-5 lg:p-9 bg-primary-1 rounded-sm text-sm lg:text-base text-center text-secondary-2">
      {{ $t('components.home.announcements.not-found') }}
    </p>
  </div>
</template>
