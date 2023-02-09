<script setup lang="ts">
const props = defineProps({
  error: Object,
});

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <div class="flex flex-col min-h-screen pb-16">
    <NuxtLoadingIndicator color="#6F6BF2" />
    <PageTitle :title="$t('error-page.title')" />
    <div class="flex flex-col gap-6 p-3">
      <h1 class="text-center">{{ $t('error-page.message') }}</h1>
      <NuxtIcon name="caution-sign" class="self-center text-8xl" />
      <button class="btn-accent" @click.prevent="handleError">{{ $t('error-page.go-back') }}</button>
    </div>
    <Navbar />
    <Snackbar />
  </div>
</template>
