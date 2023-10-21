export default defineNuxtRouteMiddleware((to, _from) => {
  const localePath = useLocalePath()
  const firebaseUser = useFirebase.currentUser()
  const firebaseChecked = useFirebase.checkedFirstTime()
  if (!firebaseChecked.value)
    return navigateTo(localePath({ name: 'loading', query: { redirect: to.fullPath } }))
  if (!firebaseUser.value)
    return navigateTo(localePath({ name: 'login', query: { redirect: to.fullPath } }))
})
