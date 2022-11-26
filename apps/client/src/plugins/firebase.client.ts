import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '~~/firebase-config';
import { useUserStore, useAlertsStore } from '~/stores';

export default defineNuxtPlugin(({ vueApp }) => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  onAuthStateChanged(auth, async (user) => {
    const route = useRoute();
    const userStore = useUserStore();
    const alertsStore = useAlertsStore();
    try {
      useFirebase.user().value = user;
      if (user) {
        userStore.fetchUser(user.uid, { save: true });
        if (route.query.redirect) {
          return navigateTo(route.query.redirect.toString());
        }
      } else {
        userStore.$reset();
        if (route.meta.middleware && (route.meta.middleware as string[]).includes('auth')) {
          return navigateTo({ name: 'login', query: { redirect: route.fullPath } });
        }
      }
    } catch (error) {
      alertsStore.handleError(error);
    } finally {
      userStore.authChecked = true;
      useFirebase.checked().value = true;
    }
  });
  useFirebase.app().value = app;
  useFirebase.auth().value = auth;
});
