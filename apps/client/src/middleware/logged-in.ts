export default defineNuxtRouteMiddleware((to, _from) => {
  const firebaseUser = useFirebase.currentUser();
  const firebaseChecked = useFirebase.checkedFirstTime();

  if (!firebaseUser.value) {
    if (!firebaseChecked.value) {
      return navigateTo({ name: 'loading', query: { redirect: to.fullPath } });
    }
    return navigateTo({ name: 'login', query: { redirect: to.fullPath } });
  }
});
