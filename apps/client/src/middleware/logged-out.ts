import { MiddlewareKey } from '~~/.nuxt/types/middleware';

export default defineNuxtRouteMiddleware((to, from) => {
  const firebaseUser = useFirebase.user();
  if (firebaseUser.value) {
    if (from) {
      if (from.meta.middleware && (from.meta.middleware as MiddlewareKey[]).includes('logged-out')) {
        return navigateTo('/');
      }
      return navigateTo(from);
    }
    return navigateTo('/');
  }
});
