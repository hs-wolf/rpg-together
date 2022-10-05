<script setup lang="ts">
const showMobileMenu = ref(false);

const mobileMenuRef = ref();
onClickOutside(mobileMenuRef, () => {
  if (!showMobileMenu.value) {
    return;
  }
  showMobileMenu.value = !showMobileMenu.value;
});

const menus = [
  { name: 'home', label: 'Home', icon: 'home' },
  { name: 'tables-list', label: 'Tables list', icon: 'list' },
  { name: 'profile', label: 'Profile', icon: 'profile' },
  { name: 'tables', label: 'My Tables', icon: 'table' },
  { name: 'notifications', label: 'Notifications', icon: 'notifications' },
  { name: 'about', label: 'About', icon: 'about' },
];
</script>

<template>
  <nav class="relative flex justify-between items-center gap-2 p-4">
    <div class="flex gap-2">
      <nuxt-icon name="logo" class="text-[32px] text-secondary" fill />
      <div class="flex flex-col gap-1 text-sm text-secondary font-semibold leading-none tracking-widest">
        <p>rpg</p>
        <p>together</p>
      </div>
    </div>
    <button class="active:scale-90 transition-transform" @click="showMobileMenu = !showMobileMenu">
      <nuxt-icon name="hamburguer-menu" class="text-[32px] text-primary-light" />
    </button>
    <div
      ref="mobileMenuRef"
      class="fixed top-0 right-0 flex flex-col w-3/4 max-w-[320px] h-screen bg-secondary-light shadow-sm shadow-secondary-dark text-primary-dark transition-transform"
      :class="{ 'translate-x-[100%] ': !showMobileMenu }"
    >
      <div class="flex justify-between gap-2 p-4">
        <div class="flex items-center gap-2 overflow-hidden">
          <img
            src="https://i.pinimg.com/280x280_RS/6b/c7/31/6bc731fbe8866f02d929c5579ccd4f45.jpg"
            alt="Username"
            class="w-[32px] rounded-full"
          />
          <h1 class="font-semibold truncate">Usernameeeeeeeeeeeeeeeeeeeeeee</h1>
        </div>
        <button @click="showMobileMenu = !showMobileMenu" class="active:scale-90 transition-transform">
          <nuxt-icon name="close" class="text-[32px] text-primary-light" />
        </button>
      </div>
      <div class="flex flex-col">
        <button
          v-for="item in menus"
          :key="item.name"
          class="flex items-center gap-2 px-4 py-2 hover:bg-secondary active:bg-secondary active:px-6 transition-all"
        >
          <nuxt-icon :name="item.icon" class="text-xl text-secondary-dark" />
          <p
            v-if="item.name === 'notifications'"
            class="flex justify-center items-center h-[24px] px-2 bg-accent-light rounded-full text-sm text-secondary font-semibold"
          >
            99+
          </p>
          <p>{{ item.label }}</p>
        </button>
      </div>
      <div class="grid grid-cols-2 gap-2 p-4">
        <button class="btn-accent">Login</button>
        <button class="btn-secondary">Register</button>
      </div>
    </div>
  </nav>
</template>
