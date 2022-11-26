import { MiddlewareKey } from '~~/.nuxt/types/middleware';

export default defineNuxtRouteMiddleware((to, from) => {
  const firebaseUser = useFirebase.user();
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
