<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/stores';

definePageMeta({ layout: 'loading' });

const userStore = useUserStore();
const { authChecked } = storeToRefs(userStore);

const route = useRoute();
watch(authChecked, () => {
  if (authChecked.value) {
    if (route.query.redirect) {
      return navigateTo(route.query.redirect.toString());
    }
    return navigateTo('/');
  }
});
</script>

<template>
  <div>
    <NuxtIcon name="logo" class="text-2xl animate-pulse" />
  </div>
</template>
