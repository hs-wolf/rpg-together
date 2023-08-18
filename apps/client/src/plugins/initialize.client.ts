import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { MiddlewareKey } from '~~/.nuxt/types/middleware';
import { firebaseConfig } from '~/firebase-config';
import { useAlertsStore, useLocalesStore, useUserStore, useFlairsStore, useNotificationsStore } from '~/stores';

export default defineNuxtPlugin(({ hook }) => {
  hook('app:created', () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    useFirebase.firebaseApp().value = app;
    useFirebase.firebaseAuth().value = auth;

    const localeRoute = useLocaleRoute();
    const route = useRoute();
    const pinia = usePinia();
    const alertsStore = useAlertsStore(pinia);
    const notificationsStore = useNotificationsStore(pinia);
    const localesStore = useLocalesStore(pinia);
    const userStore = useUserStore(pinia);
    const flairsStore = useFlairsStore(pinia);

    localesStore.loadLocale();
    flairsStore.fetchAllFlairs({ save: true });

    onAuthStateChanged(auth, async (user) => {
      try {
        useFirebase.currentUser().value = user;
        useFirebase.checkedFirstTime().value = true;
        if (user) {
          userStore.getUser(user.uid, { save: true });
          notificationsStore.getMyNotifications({ save: true });
          if (route.query.redirect) {
            return navigateTo(route.query.redirect.toString());
          }
          if (route.meta.middleware && (route.meta.middleware as MiddlewareKey[]).includes('logged-out')) {
            return navigateTo('/');
          }
          return;
        }
        userStore.$reset();
        if (route.meta.middleware && (route.meta.middleware as string[]).includes('logged-in')) {
          return navigateTo(localeRoute({ name: 'login', query: { redirect: route.fullPath } }));
        }
        if (route.query.redirect) {
          return navigateTo(route.query.redirect.toString());
        }
      } catch (error) {
        alertsStore.handleError(error);
      }
    });
  });
});
