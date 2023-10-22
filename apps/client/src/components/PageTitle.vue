<script setup lang="ts">
const props = defineProps<{ title?: string; back?: string | boolean }>()

const previousRoute = useRouter().options.history.state.back

const finalPreviousRoute = computed(() => {
  if (!props.back)
    return

  return typeof props.back === 'string' ? `/${props.back}` : previousRoute?.toString() ?? '/'
})
</script>

<template>
  <div
    class="flex items-center gap-3 min-h-[6rem] p-3 bg-gradient-to-b from-accent-dark/75 to-primary text-xl tracking-widest font-semibold"
    :class="finalPreviousRoute ? 'justify-between' : 'justify-center'"
  >
    <NuxtLink v-if="finalPreviousRoute" :to="{ path: finalPreviousRoute }">
      <NuxtIcon name="chevron-left" class="text-2xl" />
    </NuxtLink>
    <div class="flex items-center gap-2">
      <NuxtIcon name="logo" class="text-5xl" />
      <p class="text-2xl  font-righteous">
        {{ title ?? $t('home.title') }}
      </p>
    </div>
  </div>
</template>
