import { useUserStore } from '~/stores';

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const nuxtApp = useNuxtApp();
  const firebaseUser = nuxtApp.$firebaseAuth?.currentUser;

  if (!firebaseUser) {
    if (!userStore.authChecked) {
      return navigateTo({ name: 'loading', query: { redirect: to.fullPath } });
    }
    return navigateTo({ name: 'login', query: { redirect: to.fullPath } });
  }
});
