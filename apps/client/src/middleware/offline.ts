import { MiddlewareKey } from '~~/.nuxt/types/middleware';

export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  const firebaseUser = nuxtApp.$firebaseAuth ? nuxtApp.$firebaseAuth.currentUser : null;
  if (firebaseUser) {
    if (from) {
      if (from.meta.middleware && (from.meta.middleware as MiddlewareKey[]).includes('offline')) {
        return navigateTo('/');
      }
      return navigateTo(from);
    }
    return navigateTo('/');
  }
});
