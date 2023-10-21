import type { MiddlewareKey } from '~~/.nuxt/types/middleware'

export default defineNuxtRouteMiddleware((to, from) => {
  const localePath = useLocalePath()
  const firebaseUser = useFirebase.currentUser()
  const firebaseChecked = useFirebase.checkedFirstTime()
  if (!firebaseChecked.value)
    return navigateTo(localePath({ name: 'loading', query: { redirect: to.fullPath } }))
  if (firebaseUser.value) {
    if ((from.meta.middleware && (from.meta.middleware as MiddlewareKey[]).includes('logged-out')) || from.path === '/loading')
      return navigateTo(localePath({ name: 'index' }))
    return navigateTo(from)
  }
})
