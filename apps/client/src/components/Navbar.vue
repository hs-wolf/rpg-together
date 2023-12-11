<script setup lang="ts">
import { SupportedLanguages } from '@rpg-together/models'
import { DEFAULT_USER_AVATAR } from '@rpg-together/utilities'
import { useLocalesStore, useNotificationsStore, useUserStore } from '~/stores'
import { AppDirections } from '~/types'

const localePath = useLocalePath()
const checkedFirstTime = useFirebase.checkedFirstTime()
const firebaseUser = useFirebase.currentUser()
const localesStore = useLocalesStore()
const notificationsStore = useNotificationsStore()
const { unreadNotifications } = storeToRefs(notificationsStore)
const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const mobileTabs = [
  { name: 'home', icon: 'home', link: 'index' },
  { name: 'search', icon: 'search-tool', link: 'search' },
]
const mobileMenu = [
  { name: 'announcements', icon: 'pin', link: 'announcements' },
  { name: 'my-applications', icon: 'message', link: 'my-applications' },
  { name: 'my-tables', icon: 'bar-table', link: 'my-tables' },
  // { name: 'settings', icon: 'settings-cog', link: 'settings' },
  // { name: 'about', icon: 'information-circle', link: 'about' },
  { name: 'notifications', icon: 'bell', link: 'notifications' },
]
const desktopNavOptions = [
  { name: 'home', icon: 'home', link: 'index' },
  { name: 'search', icon: 'search-tool', link: 'search' },
  { name: 'announcements', icon: 'pin', link: 'announcements' },
  { name: 'my-applications', icon: 'message', link: 'my-applications' },
  { name: 'my-tables', icon: 'bar-table', link: 'my-tables' },
  // { name: 'settings', icon: 'settings-cog', link: 'settings' },
  // { name: 'about', icon: 'information-circle', link: 'about' },
]

const showMobileMenu = ref(false)
const mobileMenuRef = ref<HTMLDivElement>()

const mobileMenuCardDirection = computed<{ transition: string; align: string }>(() =>
  localesStore.direction === AppDirections.LTR ? { transition: 'slide-left', align: 'self-end' } : { transition: 'slide-right', align: 'self-start' })

function closeMobileMenu() {
  showMobileMenu.value = false
}

async function logout() {
  await userStore.signOut()
  closeMobileMenu()
}

onClickOutside(mobileMenuRef, () => {
  if (!showMobileMenu.value)
    return

  showMobileMenu.value = !showMobileMenu.value
})
</script>

<template>
  <nav>
    <div class="mobile-nav">
      <button class="tab-button" @click.prevent="showMobileMenu = !showMobileMenu">
        <NuxtIcon name="hamburger-menu" class="transition-transform" :class="{ 'rotate-90': showMobileMenu }" />
        <p>{{ $t('components.navbar.menu') }}</p>
      </button>
      <NuxtLink
        v-for="tab in mobileTabs"
        :key="tab.name"
        :to="localePath({ name: tab.link })"
        class="tab-button"
        active-class="text-accent-2"
      >
        <NuxtIcon :name="tab.icon" />
        <p>{{ $t(`components.navbar.${tab.name}`) }}</p>
      </NuxtLink>
      <Transition :name="mobileMenuCardDirection.transition">
        <Modal v-if="showMobileMenu">
          <div ref="mobileMenuRef" class="flex flex-col gap-3 w-full max-w-[80%] h-full bg-secondary text-primary overflow-auto" :class="mobileMenuCardDirection.align">
            <div v-if="firebaseUser" class="z-10 relative flex flex-col">
              <NuxtLink
                :to="localePath({ name: 'profile' })"
                class="z-20 flex items-center gap-1.5 p-3 transition-all active:px-5"
                @click.prevent="closeMobileMenu"
              >
                <NuxtIcon name="user" class="text-2xl" />
                <p class="text-xl font-semibold leading-8">
                  {{ user?.username }}
                </p>
              </NuxtLink>
              <div class="z-10 absolute top-0 aspect-square">
                <NuxtImg
                  :src="user?.avatar ?? DEFAULT_USER_AVATAR"
                  :alt="user?.username"
                  width="512"
                  height="512"
                  format="webp"
                  class="h-full object-cover pointer-events-none"
                />
                <div class="absolute inset-0 flex bg-gradient-to-b from-secondary/50 to-secondary" />
              </div>
            </div>
            <div v-else-if="checkedFirstTime" class="z-20 grid grid-cols-2 gap-3 p-3">
              <NuxtLink :to="localePath({ name: 'login' })">
                <BaseButton theme="accent" :label="$t('components.navbar.login')" :action="closeMobileMenu" />
              </NuxtLink>
              <NuxtLink :to="localePath({ name: 'register' })">
                <BaseButton theme="action" :label="$t('components.navbar.register')" :action="closeMobileMenu" />
              </NuxtLink>
            </div>
            <div class="z-20 flex-1 flex flex-col items-start gap-3">
              <NuxtLink
                v-for="item in mobileMenu"
                :key="item.name"
                :to="localePath({ name: item.link })"
                class="menu-button"
                active-class="active-menu-button"
                @click.prevent="closeMobileMenu"
              >
                <NuxtIcon :name="item.icon" />
                <p>{{ $t(`components.navbar.${item.name}`) }}</p>
              </NuxtLink>
              <button
                class="menu-button"
                @click.prevent="
                  $i18n.locale === 'en' ? localesStore.changeLocale(SupportedLanguages.PT) : localesStore.changeLocale(SupportedLanguages.EN)
                "
              >
                <NuxtIcon :name="`flags/${$i18n.locale}`" filled />
                <p>{{ $t('components.navbar.language') }}</p>
              </button>
              <button v-if="firebaseUser" class="menu-button mt-3 text-danger" @click.prevent="logout">
                <NuxtIcon name="logout" />
                <p>{{ $t('components.navbar.logout') }}</p>
              </button>
            </div>
          </div>
        </Modal>
      </Transition>
    </div>
    <div class="desktop-nav">
      <div class="flex flex-col gap-10 w-full lg:max-w-5xl lg:mx-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-5">
            <NuxtIcon name="logo" class="text-4xl" />
            <h1 class="text-4xl font-righteous font-semibold tracking-widest">
              {{ $t('general.app-name') }}
            </h1>
          </div>
          <div v-if="firebaseUser" class="flex items-center gap-7">
            <button
              class="btn-effect"

              @click.prevent="
                $i18n.locale === 'en' ? localesStore.changeLocale(SupportedLanguages.PT) : localesStore.changeLocale(SupportedLanguages.EN)
              "
            >
              <NuxtIcon :name="`flags/${$i18n.locale}`" filled class="text-2xl" />
            </button>
            <NuxtLink :to="localePath({ name: 'notifications' })" class="btn-effect relative flex justify-center">
              <div v-if="unreadNotifications" class="absolute flex w-3 h-3 end-3 -top-0.5 bg-gradient-to-b from-danger to-danger-2 rounded-full" />
              <NuxtIcon name="bell" class="text-2xl" />
            </NuxtLink>
            <NuxtLink :to="localePath({ name: 'profile' })" class="btn-effect flex items-center gap-3">
              <p class="text-xl font-semibold leading-none">
                {{ user?.username }}
              </p>
              <NuxtImg
                :src="user?.avatar ?? DEFAULT_USER_AVATAR"
                :alt="user?.username"
                width="128"
                height="128"
                format="webp"
                class="w-[34px] h-[34px] rounded-sm object-cover shadow"
              />
            </NuxtLink>
            <button class="btn-effect" @click.prevent="logout">
              <NuxtIcon name="logout" class="text-2xl text-danger" />
            </button>
          </div>
          <div v-else-if="checkedFirstTime" class="flex gap-3">
            <NuxtLink :to="localePath({ name: 'login' })">
              <BaseButton theme="accent" :label="$t('components.navbar.login')" />
            </NuxtLink>
            <NuxtLink :to="localePath({ name: 'register' })">
              <BaseButton theme="action" :label="$t('components.navbar.register')" />
            </NuxtLink>
          </div>
        </div>
        <div class="flex justify-start items-center gap-1">
          <NuxtLink
            v-for="option in desktopNavOptions"
            :key="option.name"
            :to="localePath({ name: option.link })"
            class="menu-button"
            active-class="active-menu-button"
          >
            <NuxtIcon :name="option.icon" />
            <p class="whitespace-nowrap">
              {{ $t(`components.navbar.${option.name}`) }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.mobile-nav {
  @apply z-30 lg:hidden fixed bottom-0 grid grid-cols-3 w-full h-[58px] bg-primary;
  .tab-button {
    @apply relative flex flex-col justify-center items-center gap-1 h-full transition-colors active:bg-primary-1;
    .nuxt-icon {
      @apply text-base;
    }
    p {
      @apply text-sm leading-none;
    }
  }
  .menu-button {
    @apply flex items-center gap-1.5 px-3 py-2 rounded-e-sm transition-all active:px-5;
    .nuxt-icon {
      @apply text-lg;
    }
    p {
      @apply text-base leading-none;
    }
  }
  .active-menu-button {
      @apply bg-accent-2 font-semibold text-secondary shadow
    }
}

.desktop-nav {
  @apply z-30 hidden lg:flex flex-col py-10 bg-gradient-to-b from-secondary to-secondary-1 text-primary;
  .menu-button {
    @apply flex justify-center items-center gap-1.5 w-full px-3 py-2 border shadow rounded-sm font-semibold transition-transform bg-secondary border-secondary-2 text-primary;
    @apply active:scale-95 active:bg-secondary-2;
    @apply disabled:opacity-50 disabled:pointer-events-none;
  }
  .active-menu-button {
    @apply bg-accent-2 font-semibold text-secondary shadow;
  }
}
</style>
