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
    class="flex bg-gradient-to-b from-accent to-accent-dark"
  >
    <div class="flex items-center gap-2 w-full px-2 py-4 tracking-widest font-semibold lg:px-0 lg:py-6 lg:max-w-5xl lg:mx-auto" :class="finalPreviousRoute ? 'justify-between' : 'justify-center'">
      <NuxtLink v-if="finalPreviousRoute" :to="{ path: finalPreviousRoute }">
        <NuxtIcon name="chevron-left" class="text-2xl lg:text-3xl" />
      </NuxtLink>
      <div class="flex items-center gap-4">
        <NuxtIcon v-if="!hideIcon" name="logo" class="text-3xl lg:text-4xl" />
        <p class="text-xl lg:text-2xl font-righteous">
          {{ title ?? $t('home.title') }}
        </p>
      </div>
    </div>
  </div>
</template>
