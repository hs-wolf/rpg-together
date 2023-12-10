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

const tabs = [
  { name: 'home', icon: 'home', link: 'index' },
  { name: 'search', icon: 'search-tool', link: 'search' },
]
const menus = [
  { name: 'profile', icon: 'user', link: 'profile' },
  { name: 'notifications', icon: 'bell', link: 'notifications' },
  { name: 'my-applications', icon: 'message', link: 'my-applications' },
  { name: 'my-tables', icon: 'bar-table', link: 'my-tables' },
  // { name: 'settings', icon: 'settings-cog', link: 'settings' },
  { name: 'announcements', icon: 'pin', link: 'announcements' },
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
        <p>{{ $t('components.navbar.tabs.menu') }}</p>
      </button>
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="localePath({ name: tab.link })"
        class="tab-button"
        active-class="text-accent font-semibold"
      >
        <NuxtIcon :name="tab.icon" />
        <p>{{ $t(`components.navbar.tabs.${tab.name}`) }}</p>
      </NuxtLink>
      <Transition :name="mobileMenuCardDirection.transition">
        <Modal v-if="showMobileMenu">
          <div ref="mobileMenuRef" class="flex flex-col w-full max-w-[80%] h-full bg-secondary text-primary" :class="mobileMenuCardDirection.align">
            <div v-if="firebaseUser" class="z-10 relative flex flex-col">
              <NuxtLink
                :to="localePath({ name: 'profile' })"
                class="z-20 flex items-center p-3 text-lg font-semibold truncate leading-8"
                @click.prevent="closeMobileMenu"
              >
                {{ user?.username }}
              </NuxtLink>
              <div class="z-10 absolute top-0 aspect-square">
                <NuxtImg
                  :src="user?.avatar ?? DEFAULT_USER_AVATAR"
                  :alt="user?.username"
                  width="512"
                  height="512"
                  format="webp"
                  class="opacity-40 h-full object-cover pointer-events-none"
                />
                <div class="absolute inset-0 flex bg-gradient-to-b from-transparent to-secondary" />
              </div>
            </div>
            <div v-else-if="checkedFirstTime" class="z-20 grid grid-cols-2 gap-3 p-3">
              <NuxtLink :to="localePath({ name: 'login' })" class="btn-accent" @click.prevent="closeMobileMenu">
                {{ $t('components.navbar.menus.login') }}
              </NuxtLink>
              <NuxtLink :to="localePath({ name: 'register' })" class="btn-secondary" @click.prevent="closeMobileMenu">
                {{ $t('components.navbar.menus.register') }}
              </NuxtLink>
            </div>
            <div class="z-20 flex-1 flex flex-col items-start gap-1 overflow-auto">
              <NuxtLink
                v-for="item in menus"
                :key="item.name"
                :to="localePath({ name: item.link })"
                class="menu-button"
                active-class="text-accent font-semibold"
                @click.prevent="closeMobileMenu"
              >
                <NuxtIcon :name="item.icon" />
                <p>{{ $t(`components.navbar.menus.${item.name}`) }}</p>
              </NuxtLink>
              <button
                class="menu-button"
                @click.prevent="
                  $i18n.locale === 'en' ? localesStore.changeLocale(SupportedLanguages.PT) : localesStore.changeLocale(SupportedLanguages.EN)
                "
              >
                <NuxtIcon :name="`flags/${$i18n.locale}`" filled />
                <p>{{ $t('components.navbar.menus.language') }}</p>
              </button>
              <button v-if="firebaseUser" class="menu-button mt-5 text-danger" @click.prevent="logout">
                <NuxtIcon name="logout" />
                <p>{{ $t('components.navbar.menus.logout') }}</p>
              </button>
            </div>
          </div>
        </Modal>
      </Transition>
    </div>
    <div class="desktop-nav">
      <div class="grid grid-cols-3 lg:max-w-5xl lg:mx-auto">
        <div class="col-span-2 flex flex-wrap items-center gap-5">
          <NuxtLink
            v-for="tab in tabs"
            :key="tab.name"
            :to="localePath({ name: tab.link })"
            class="nav-button"
            active-class="active-nav-button"
          >
            <NuxtIcon :name="tab.icon" />
            <p>{{ $t(`components.navbar.tabs.${tab.name}`) }}</p>
          </NuxtLink>
          <NuxtLink
            v-for="item in menus"
            :key="item.name"
            :to="localePath({ name: item.link })"
            class="nav-button"
            active-class="active-nav-button"
            @click.prevent="closeMobileMenu"
          >
            <NuxtIcon :name="item.icon" />
            <p>{{ $t(`components.navbar.menus.${item.name}`) }}</p>
          </NuxtLink>
          <button
            class="nav-button border-none"
            @click.prevent="
              $i18n.locale === 'en' ? localesStore.changeLocale(SupportedLanguages.PT) : localesStore.changeLocale(SupportedLanguages.EN)
            "
          >
            <NuxtIcon :name="`flags/${$i18n.locale}`" filled />
            <p>{{ $t('components.navbar.menus.language') }}</p>
          </button>
        </div>
        <div class="flex flex-col justify-center items-end gap-5">
          <div v-if="firebaseUser" class="flex flex-col items-end gap-3">
            <NuxtLink :to="localePath({ name: 'profile' })" class="content-end flex justify-end items-center gap-3">
              <p class="text-lg font-semibold truncate leading-none">
                {{ user?.username }}
              </p>
              <NuxtImg
                :src="user?.avatar ?? DEFAULT_USER_AVATAR"
                :alt="user?.username"
                width="128"
                height="128"
                format="webp"
                class="w-[42px] h-[42px] rounded-sm object-cover"
              />
            </NuxtLink>
            <button class="relative flex items-center gap-1.5 active:scale-95 transition-transform text-danger" @click.prevent="logout">
              <NuxtIcon name="logout" class="text-lg" />
              <p class="leading-none whitespace-nowrap">
                {{ $t('components.navbar.menus.logout') }}
              </p>
            </button>
          </div>
          <div v-else-if="checkedFirstTime" class="flex justify-end gap-3 items-center">
            <NuxtLink :to="localePath({ name: 'login' })" class="btn-accent" @click.prevent="closeMobileMenu">
              {{ $t('components.navbar.menus.login') }}
            </NuxtLink>
            <NuxtLink :to="localePath({ name: 'register' })" class="btn-secondary" @click.prevent="closeMobileMenu">
              {{ $t('components.navbar.menus.register') }}
            </NuxtLink>
          </div>
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
      @apply text-lg;
    }
    p {
      @apply text-xs leading-none;
    }
  }
  .menu-button {
    @apply flex items-center gap-1.5 px-3 py-2 rounded-e-sm transition-all active:bg-secondary active:px-5 active:shadow;
    .nuxt-icon {
      @apply text-lg;
    }
    p {
      @apply text-sm leading-none;
    }
  }
}

.desktop-nav {
 @apply z-30 hidden lg:flex flex-col py-10 bg-gradient-to-b from-secondary to-secondary-1 text-primary;
 .nav-button {
    @apply relative flex items-center gap-1.5 pb-1.5 border-b border-b-primary/10 transition-transform hover:scale-95 active:scale-90 ;
    .nuxt-icon {
      @apply text-xl;
    }
    p {
      @apply leading-none whitespace-nowrap;
    }
 }
 .active-nav-button {
    @apply text-accent border-accent font-semibold;
 }
}
</style>
