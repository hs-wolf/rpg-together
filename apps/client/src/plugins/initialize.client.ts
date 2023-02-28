import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '~/firebase-config';
import { useAlertsStore, useLocalesStore, useUserStore, useFlairsStore } from '~/stores';

export default defineNuxtPlugin(({ hook }) => {
  hook('app:created', () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    useFirebase.firebaseApp().value = app;
    useFirebase.firebaseAuth().value = auth;

    const route = useRoute();
    const pinia = usePinia();
    const alertsStore = useAlertsStore(pinia);
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
          userStore.fetchUser(user.uid, { save: true });
          if (route.query.redirect) {
            return navigateTo(route.query.redirect.toString());
          }
          return;
        }
        userStore.$reset();
        if (route.meta.middleware && (route.meta.middleware as string[]).includes('logged-in')) {
          return navigateTo({ name: 'login', query: { redirect: route.fullPath } });
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
