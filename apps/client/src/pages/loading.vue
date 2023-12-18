<script setup lang="ts">
const { t } = useNuxtApp().$i18n

definePageMeta({ layout: 'empty' })

useHead({ title: t('pages.loading.title') })
</script>

<template>
  <LoadingIcon />
</template>
