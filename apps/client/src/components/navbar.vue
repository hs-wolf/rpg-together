<script setup lang="ts">
const showMobileMenu = ref(false);

const mobileMenuRef = ref<HTMLDivElement>();
onClickOutside(mobileMenuRef, () => {
  if (!showMobileMenu.value) {
    return;
  }
  showMobileMenu.value = !showMobileMenu.value;
});

const mockUser = {
  id: 1,
  username: 'Hajime',
  avatar: 'https://i.pinimg.com/originals/10/91/94/1091948c6b80b65b9eef8c163f0ae42a.jpg',
};

const tabs = [
  { name: 'home', icon: 'home', link: '/' },
  { name: 'search', icon: 'search', link: 'search' },
  { name: 'alerts', icon: 'bell', link: 'alerts' },
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

const logout = () => {
  closeMobileMenu();
};
</script>

<template>
  <nav class="fixed inset-x-0 bottom-0 grid grid-cols-5 gap-3 h-16 p-3 bg-primary shadow">
    <button class="tab-button" @click.prevent="showMobileMenu = !showMobileMenu">
      <nuxt-icon name="hamburguer-menu" class="transition-transform" :class="{ 'rotate-90': showMobileMenu }" />
      <p>{{ $t('navbar.tabs.menu') }}</p>
    </button>
    <nuxt-link v-for="tab in tabs" :key="tab.name" :to="tab.link" class="tab-button" active-class="text-accent font-semibold">
      <nuxt-icon :name="tab.icon" fill />
      <p>{{ $t(`navbar.tabs.${tab.name}`) }}</p>
    </nuxt-link>
    <transition name="slide-left">
      <div v-if="showMobileMenu" class="modal">
        <div
          ref="mobileMenuRef"
          class="self-end flex flex-col gap-3 w-3/4 max-w-[320px] h-full bg-secondary-light text-primary-dark"
        >
          <div class="flex justify-between gap-3 h-[64px] pr-3 shadow">
            <nuxt-link to="profile" class="relative flex items-center gap-2 overflow-hidden" @click.prevent="closeMobileMenu">
              <nuxt-img
                format="webp"
                fit="cover"
                height="64"
                loading="lazy"
                sizes="xs:100vw"
                :src="mockUser.avatar"
                :alt="mockUser.username"
                class="rounded-r-full opacity-30"
              />
              <h1 class="absolute inset-x-3 font-semibold truncate">
                {{ mockUser.username }}
              </h1>
            </nuxt-link>
            <button @click.prevent="closeMobileMenu" class="active:scale-90 transition-transform">
              <nuxt-icon name="close" class="text-xl" />
            </button>
          </div>
          <div class="flex justify-between gap-3 h-[64px] pr-3 shadow">
            <div class="grid grid-cols-2 gap-3 w-full p-3 pr-0">
              <nuxt-link to="login" class="btn-accent" @click.prevent="closeMobileMenu">
                {{ $t('navbar.menus.login') }}</nuxt-link
              >
              <nuxt-link to="register" class="btn-secondary" @click.prevent="closeMobileMenu">
                {{ $t('navbar.menus.register') }}</nuxt-link
              >
            </div>
            <button @click.prevent="closeMobileMenu" class="active:scale-90 transition-transform">
              <nuxt-icon name="close" class="text-xl" />
            </button>
          </div>
          <div class="flex flex-col">
            <nuxt-link
              v-for="item in menus"
              :key="item.name"
              :to="item.link"
              class="menu-button"
              @click.prevent="closeMobileMenu"
            >
              <nuxt-icon :name="item.icon" class="text-xl" />
              <p>{{ $t(`navbar.menus.${item.name}`) }}</p>
            </nuxt-link>
            <button class="menu-button" @click.prevent="logout">
              <nuxt-icon name="logout" class="text-xl" />
              <p>{{ $t(`navbar.menus.logout`) }}</p>
            </button>
          </div>
        </div>
      </div>
    </transition>
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
