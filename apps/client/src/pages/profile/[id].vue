<script setup lang="ts">
import type { User } from '@rpg-together/models'
import { DEFAULT_USER_AVATAR } from '@rpg-together/utilities'
import { useUserStore } from '~/stores'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const localeRoute = useLocaleRoute()
const userStore = useUserStore()
const firebaseUser = useFirebase.currentUser()

const userId = route.params.id as string
const user = ref<User | null>(null)

useHead({ title: computed(() => user.value?.username ?? t('profile.title')) })

onBeforeMount(async () => {
  checkOwnProfile()
  user.value = await userStore.getUser(userId)
  if (!user.value)
    navigateTo({ path: router.options.history.state.back?.toString() ?? '/' })
})

watch(firebaseUser, () => checkOwnProfile())

function checkOwnProfile() {
  if (firebaseUser.value?.uid === userId)
    return navigateTo(localeRoute({ name: 'profile' }))
}
</script>

<template>
  <div class="flex flex-col gap-4 h-full overflow-y-auto hide-scrollbar">
    <PageTitle :title="user?.username ?? $t('profile.title')" :back="true" />
    <div class="flex flex-col items-center gap-4">
      <NuxtImg
        :src="user?.avatar ?? DEFAULT_USER_AVATAR"
        :alt="user?.username ?? $t('profile.title')"
        width="180"
        height="180"
        sizes="sm:100vw md:50vw lg:50vw"
        format="webp"
        class="w-[50vw] h-[50vw] rounded-sm shadow object-cover"
      />
      <p class="text-xs">
        {{ $t('profile.creation-date', { date: user?.creationDate.toLocaleString(locale) }) }}
      </p>
    </div>
  </div>
</template>
