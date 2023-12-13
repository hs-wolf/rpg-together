<script setup lang="ts">
const props = defineProps<{ title?: string; back?: string | boolean; hideIcon?: boolean }>()

const previousRoute = useRouter().options.history.state.back

const finalPreviousRoute = computed(() => {
  if (!props.back)
    return

  return typeof props.back === 'string' ? `/${props.back}` : previousRoute?.toString() ?? '/'
})
</script>

<template>
  <div
    class="flex lg:hidden bg-gradient-to-b from-accent to-accent-1"
  >
    <div class="flex items-center gap-2 w-full px-3 py-4" :class="finalPreviousRoute ? 'justify-between' : 'justify-center'">
      <NuxtLink v-if="finalPreviousRoute" :to="{ path: finalPreviousRoute }">
        <NuxtIcon name="chevron-left" class="text-2xl" />
      </NuxtLink>
      <div class="flex items-center gap-3">
        <NuxtIcon v-if="!hideIcon" name="logo" class="text-2xl" />
        <p class="text-xl font-righteous tracking-widest font-semibold leading-none">
          {{ title ?? $t('pages.home.title') }}
        </p>
      </div>
    </div>
  </div>
</template>
