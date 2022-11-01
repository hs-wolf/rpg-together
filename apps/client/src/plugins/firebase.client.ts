import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MiddlewareKey } from '~~/.nuxt/types/middleware';
import { firebaseConfig } from '~~/firebase-config';
import { useUserStore, useAlertsStore } from '~/stores';

export default defineNuxtPlugin(({ vueApp }) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  onAuthStateChanged(auth, async (user) => {
    const userStore = useUserStore();
    const alertsStore = useAlertsStore();
    const route = useRoute();
    try {
      if (user) {
        userStore.fetchUser(user.uid);
        if (route.query.redirect) {
          return navigateTo(route.query.redirect.toString());
        }
        return navigateTo('/');
      } else {
        userStore.$reset();
        if (route.meta.middleware && (route.meta.middleware as MiddlewareKey[]).includes('auth')) {
          return navigateTo({ name: 'login', query: { redirect: route.fullPath } });
        }
      }
    } catch (error) {
      alertsStore.handleError(error);
    } finally {
      userStore.authChecked = true;
    }
  });
  return {
    provide: {
      firebaseApp: app,
      firebaseAuth: auth,
    },
  };
});
