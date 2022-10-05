<script setup lang="ts">
import { models } from '@rpg-together/models';
</script>

<template>
  <div class="flex items-center gap-2 text-lg font-semibold">
    <h1 class="text-primary">{{ $t('key') }}</h1>
    <nuxt-icon name="like" />
    <div class="text-blue-500">Button</div>
    <h1>{{ models() }}</h1>
  </div>
</template>
