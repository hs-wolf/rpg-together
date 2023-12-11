<script setup lang="ts">
const props = defineProps<{
  theme?: 'primary' | 'secondary' | 'accent' | 'danger' | 'action'
  disabled?: boolean
  action?: () => void
  label?: string
  icon?: string
}>()

const themeClass = computed(() => props.theme ? `btn-${props.theme}` : 'btn-primary')
</script>

<template>
  <button type="button" :name="label" class="btn-base" :class="themeClass" :disabled="disabled" @click.prevent="action">
    <NuxtIcon v-if="icon" :name="icon" class="text-lg" />
    <p v-if="label" class="leading-none whitespace-nowrap">
      {{ label }}
    </p>
  </button>
</template>

<style scoped>
.btn-base {
  @apply flex justify-center items-center gap-1.5 w-full px-3 py-2 border shadow rounded-sm text-sm font-semibold transition-transform;
  @apply lg:text-base;
  @apply active:scale-95;
  @apply disabled:opacity-50 disabled:pointer-events-none;
}
.btn-primary {
  @apply bg-primary border-primary-2 text-secondary;
  @apply active:bg-primary-2;
}
.btn-secondary {
  @apply bg-secondary border-secondary-2 text-primary;
  @apply active:bg-secondary-2;
}
.btn-accent {
  @apply bg-accent border-accent-2 text-secondary;
  @apply active:bg-accent-2;
}
.btn-danger {
  @apply bg-danger border-danger-2 text-secondary;
  @apply active:bg-danger-2;
}
.btn-action {
  @apply bg-action border-action-2 text-secondary;
  @apply active:bg-action-2;
}
</style>
