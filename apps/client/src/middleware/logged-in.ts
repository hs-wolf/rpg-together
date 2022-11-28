import { useUserStore } from '~/stores';

export default defineNuxtRouteMiddleware((to, _from) => {
  const userStore = useUserStore();
  const firebaseUser = useFirebase.currentUser();

  if (!firebaseUser.value) {
    if (!userStore.authChecked) {
      return navigateTo({ name: 'loading', query: { redirect: to.fullPath } });
    }
    return navigateTo({ name: 'login', query: { redirect: to.fullPath } });
  }
});
