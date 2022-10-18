<script setup lang="ts">
import { useAnnouncementsStore } from '~/stores';

const announcementsStore = useAnnouncementsStore();

// TODO: Change any for the announcements class.
const announcements = ref<any[]>();
onMounted(() => {
  announcements.value = announcementsStore.getAnnouncements(3);
});
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <div class="flex items-center gap-2 font-semibold">
      <nuxt-icon name="pin" />
      <h1>{{ $t('home-announcements.title') }}</h1>
    </div>
    <div v-if="announcements?.length" class="flex flex-col gap-3">
      <announcement-card v-for="announcement in announcements" :key="announcement.id" :announcement="announcement" />
      <nuxt-link to="announcements" class="btn-accent">{{ $t('home-announcements.see-all') }}</nuxt-link>
    </div>
    <loading-card v-else />
  </div>
</template>
