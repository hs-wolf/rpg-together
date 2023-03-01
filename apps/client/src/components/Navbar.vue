<script setup lang="ts">
import { AppLang } from '~/types';
import { useLocalesStore, useUserStore } from '~/stores';
import { DEFAULT_USER_AVATAR } from '@rpg-together/utils';

const firebaseUser = useFirebase.currentUser();
const localesStore = useLocalesStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const showMobileMenu = ref(false);
const mobileMenuRef = ref<HTMLDivElement>();
onClickOutside(mobileMenuRef, () => {
  if (!showMobileMenu.value) {
    return;
  }
  showMobileMenu.value = !showMobileMenu.value;
});

const tabs = [
  { name: 'home', icon: 'home', link: 'index' },
  { name: 'search', icon: 'search-tool', link: 'search' },
  { name: 'notifications', icon: 'bell', link: 'notifications' },
  { name: 'profile', icon: 'user', link: 'profile' },
];

const menus = [
  { name: 'my-applications', icon: 'message', link: 'my-applications' },
  { name: 'my-tables', icon: 'bar-table', link: 'my-tables' },
  { name: 'settings', icon: 'settings-cog', link: 'settings' },
  { name: 'about', icon: 'information-circle', link: 'about' },
];

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

const logout = async () => {
  await userStore.signOut();
  closeMobileMenu();
};
</script>

<template>
  <nav class="z-30 fixed bottom-0 grid grid-cols-5 gap-3 w-full h-16 p-3 bg-primary shadow">
    <button class="tab-button" @click.prevent="showMobileMenu = !showMobileMenu">
      <NuxtIcon name="hamburger-menu" class="transition-transform" :class="{ 'rotate-90': showMobileMenu }" />
      <p>{{ $t('navbar.tabs.menu') }}</p>
    </button>
    <NuxtLink
      v-for="tab in tabs"
      :key="tab.name"
      :to="{ name: tab.link }"
      class="tab-button"
      active-class="text-accent font-semibold"
    >
      <NuxtIcon :name="tab.icon" />
      <p>{{ $t(`navbar.tabs.${tab.name}`) }}</p>
    </NuxtLink>
    <Transition name="slide-left">
      <div v-if="showMobileMenu" class="modal">
        <div ref="mobileMenuRef" class="self-end flex flex-col w-3/4 max-w-[320px] h-full bg-secondary-light text-primary-dark">
          <div v-if="firebaseUser" class="relative flex justify-between items-center h-[64px] shadow overflow-hidden">
            <NuxtImg
              :src="user?.avatar ?? DEFAULT_USER_AVATAR"
              :alt="user?.username"
              width="320"
              height="320"
              sizes="sm:100vw md:50vw lg:320px"
              format="webp"
              class="absolute inset-x-0 w-full opacity-30 bg-cover blur-[1px] pointer-events-none"
            />
            <NuxtLink to="profile" class="flex items-center w-full p-3 overflow-hidden" @click.prevent="closeMobileMenu">
              <h1 class="font-semibold truncate">{{ user?.username }}</h1>
            </NuxtLink>
            <button class="p-3 active:scale-90 transition-transform" @click.prevent="logout">
              <NuxtIcon name="logout" class="text-xl text-danger" />
            </button>
          </div>
          <div v-else class="flex justify-between gap-3 h-[64px] pr-3 shadow">
            <div class="grid grid-cols-2 gap-3 w-full p-3 pr-0">
              <NuxtLink to="login" class="btn-accent" @click.prevent="closeMobileMenu">
                {{ $t('navbar.menus.login') }}</NuxtLink
              >
              <NuxtLink to="register" class="btn-secondary" @click.prevent="closeMobileMenu">
                {{ $t('navbar.menus.register') }}</NuxtLink
              >
            </div>
          </div>
          <div class="flex flex-col gap-3 h-full py-3">
            <NuxtLink
              v-for="item in menus"
              :key="item.name"
              :to="{ name: item.link }"
              class="menu-button"
              @click.prevent="closeMobileMenu"
            >
              <NuxtIcon :name="item.icon" />
              <p>{{ $t(`navbar.menus.${item.name}`) }}</p>
            </NuxtLink>
            <button
              @click.prevent="
                $i18n.locale === 'en' ? localesStore.changeLocale(AppLang.PT) : localesStore.changeLocale(AppLang.EN)
              "
              class="menu-button"
            >
              <NuxtIcon :name="`flags/${$i18n.locale}`" filled />
              <p>Language</p>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped lang="scss">
.tab-button {
  @apply flex flex-col items-center gap-1 text-xl active:scale-90 transition-transform;
  p {
    @apply text-xs;
  }
}
.menu-button {
  @apply flex items-center gap-2 p-3 hover:bg-secondary active:bg-secondary active:px-4 transition-all;
  .nuxt-icon {
    @apply text-xl;
  }
}
</style>
