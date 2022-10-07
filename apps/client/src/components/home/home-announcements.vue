<script setup lang="ts">
import { formatDateSimple } from '@rpg-together/utils';

const announcements = [
  {
    id: '1',
    date: new Date(),
    title: 'First announcement',
    message:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tellus arcu, pretium ut lorem in, tempor laoreet neque.Proin biam.',
  },
  {
    id: '2',
    date: new Date(),
    title: 'Second announcement',
    message:
      'Nam interdum, arcu eget luctus ornare, metus lacus porttitor sem, eget mollis turpis turpis ac massa. Pellentesque dolor mauris.',
  },
  {
    id: '3',
    date: new Date(),
    title: 'Third announcement',
    message:
      'Integer metus lorem, commodo sed pharetra id, cursus id enim. Cras lobortis neque eu ullamcorper elementum. Fusce eu elit ut ut.',
  },
];
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <div class="flex items-center gap-2 font-semibold">
      <nuxt-icon name="pin" />
      <h1>{{ $t('home-announcements.title') }}</h1>
    </div>
    <div class="flex flex-col gap-3">
      <div v-for="announcement in announcements" :key="announcement.id" class="flex flex-col gap-2">
        <span class="text-xs opacity-50">{{ formatDateSimple(announcement.date, $i18n.locale) }}</span>
        <div class="flex flex-col gap-2">
          <h1 class="text-accent-light font-semibold">{{ announcement.title }}</h1>
          <p class="text-sm">
            {{ announcement.message }}
          </p>
        </div>
        <hr class="border-secondary/20" />
      </div>
    </div>
    <nuxt-link to="announcements" class="btn-accent">{{ $t('home-announcements.see-all') }}</nuxt-link>
  </div>
</template>
