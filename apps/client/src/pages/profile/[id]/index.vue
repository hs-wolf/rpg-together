<script setup lang="ts">
import type { User } from '@rpg-together/models'
import { DEFAULT_USER_AVATAR } from '@rpg-together/utilities'
import { useUserStore } from '~/stores'

const { t, locale } = useNuxtApp().$i18n
const route = useRoute()
const router = useRouter()
const localeRoute = useLocaleRoute()
const userStore = useUserStore()
const firebaseUser = useFirebase.currentUser()

const userId = route.params.id as string
const user = ref<User | null>(null)

function checkOwnProfile() {
  if (firebaseUser.value?.uid === userId)
    return navigateTo(localeRoute({ name: 'profile' }), { replace: true })
}

useHead({ title: computed(() => t('pages.profile.title', { name: user.value?.username ?? '...' })) })

watch(firebaseUser, () => checkOwnProfile())

onBeforeMount(async () => {
  checkOwnProfile()
  user.value = await userStore.getUser(userId)
  if (!user.value)
    navigateTo({ path: router.options.history.state.back?.toString() ?? '/' })
})
</script>

<template>
  <div class="flex flex-col gap-5 lg:pt-9 lg:gap-9">
    <PageTitle :title="user?.username ?? $t('pages.profile.title')" :back="true" />
    <div class="flex flex-col gap-3 w-full px-3 lg:grid lg:grid-cols-2 lg:px-0 lg:gap-5 lg:max-w-5xl lg:mx-auto">
      <div class="flex flex-col items-center lg:items-start gap-3 lg:gap-5">
        <NuxtImg
          :src="user?.avatar ?? DEFAULT_USER_AVATAR"
          :alt="user?.username ?? $t('pages.profile.title')"
          width="180"
          height="180"
          class="w-[180px] lg:w-[256px] aspect-square rounded-sm shadow object-cover"
        />
        <h1 class="text-2xl lg:text-3xl font-semibold">
          {{ user?.username }}
        </h1>
      </div>
      <p class="text-xs text-center lg:text-start">
        {{ $t('pages.profile.creation-date', { date: user?.creationDate.toLocaleString(locale) }) }}
      </p>
    </div>
  </div>
</template>
