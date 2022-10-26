export default defineNuxtRouteMiddleware((to, from) => {
  const nuxtApp = useNuxtApp();
  const firebaseUser = nuxtApp.$firebaseAuth ? nuxtApp.$firebaseAuth.currentUser : null;

  if (firebaseUser) {
    console.log('offline middleware');
    return navigateTo(from);
  }
});
