<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '~/stores';
import { DEFAULT_USER_AVATAR } from '@rpg-together/utils';

const nuxtApp = useNuxtApp();
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
  { name: 'home', icon: 'home', link: '/' },
  { name: 'search', icon: 'search', link: 'search' },
  { name: 'notifications', icon: 'bell', link: 'notifications' },
  { name: 'profile', icon: 'user', link: 'profile' },
];

const menus = [
  { name: 'my-applications', icon: 'message', link: 'my-applications' },
  { name: 'my-tables', icon: 'table', link: 'my-tables' },
  { name: 'settings', icon: 'settings', link: 'settings' },
  { name: 'about', icon: 'about', link: 'about' },
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
  <nav class="fixed inset-x-0 bottom-0 grid grid-cols-5 gap-3 h-16 p-3 bg-primary shadow">
    <button class="tab-button" @click.prevent="showMobileMenu = !showMobileMenu">
      <NuxtIcon name="hamburguer-menu" class="transition-transform" :class="{ 'rotate-90': showMobileMenu }" />
      <p>{{ $t('navbar.tabs.menu') }}</p>
    </button>
    <NuxtLink v-for="tab in tabs" :key="tab.name" :to="tab.link" class="tab-button" active-class="text-accent font-semibold">
      <NuxtIcon :name="tab.icon" fill />
      <p>{{ $t(`navbar.tabs.${tab.name}`) }}</p>
    </NuxtLink>
    <Transition name="slide-left">
      <div v-if="showMobileMenu" class="modal">
        <div
          ref="mobileMenuRef"
          class="self-end flex flex-col gap-3 w-3/4 max-w-[320px] h-full bg-secondary-light text-primary-dark"
        >
          <div v-if="nuxtApp.$firebaseAuth.currentUser" class="flex justify-between h-[64px] shadow">
            <NuxtLink to="profile" class="relative flex items-center w-full overflow-hidden" @click.prevent="closeMobileMenu">
              <NuxtImg
                :src="user?.avatar ?? DEFAULT_USER_AVATAR"
                :alt="user?.username"
                width="auto"
                height="64"
                sizes="sm:100vw md:50vw lg:400px"
                format="webp"
                class="w-full rounded-r-full opacity-30 object-cover"
              />
              <h1 class="absolute inset-x-3 font-semibold truncate">
                {{ user?.username }}
              </h1>
            </NuxtLink>
            <button @click.prevent="closeMobileMenu" class="p-3 active:scale-90 transition-transform">
              <NuxtIcon name="close" class="text-xl" />
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
            <button @click.prevent="closeMobileMenu" class="active:scale-90 transition-transform">
              <NuxtIcon name="close" class="text-xl" />
            </button>
          </div>
          <div class="flex flex-col">
            <NuxtLink
              v-for="item in menus"
              :key="item.name"
              :to="item.link"
              class="menu-button"
              @click.prevent="closeMobileMenu"
            >
              <NuxtIcon :name="item.icon" class="text-xl" />
              <p>{{ $t(`navbar.menus.${item.name}`) }}</p>
            </NuxtLink>
            <button class="menu-button" @click.prevent="logout">
              <NuxtIcon name="logout" class="text-xl" />
              <p>{{ $t(`navbar.menus.logout`) }}</p>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.tab-button {
  @apply flex flex-col items-center gap-1 text-xl active:scale-90 transition-transform;
  p {
    @apply text-xs;
  }
}
.menu-button {
  @apply flex items-center gap-2 p-3 hover:bg-secondary active:bg-secondary active:px-4 transition-all;
}
</style>
