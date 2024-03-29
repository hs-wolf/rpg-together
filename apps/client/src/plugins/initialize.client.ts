import type { FirebaseOptions } from 'firebase/app'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import type { MiddlewareKey } from '~~/.nuxt/types/middleware'
import { useAlertsStore, useApplicationsStore, useFlairsStore, useLocalesStore, useNotificationsStore, useSnackbarStore, useTablesStore, useUserStore } from '~/stores'
import { SnackType } from '~/types'

export default defineNuxtPlugin(({ hook }) => {
  hook('app:suspense:resolve', () => {
    const app = initializeApp(useRuntimeConfig().public.FIREBASE_CONFIG as FirebaseOptions)
    const auth = getAuth(app)

    useFirebase.firebaseApp().value = app
    useFirebase.firebaseAuth().value = auth

    const localePath = useLocalePath()
    const route = useRoute()
    const pinia = usePinia()
    const alertsStore = useAlertsStore(pinia)
    const notificationsStore = useNotificationsStore(pinia)
    const localesStore = useLocalesStore(pinia)
    const userStore = useUserStore(pinia)
    const flairsStore = useFlairsStore(pinia)
    const snackbarStore = useSnackbarStore(pinia)
    const tablesStore = useTablesStore(pinia)
    const applicationsStore = useApplicationsStore(pinia)

    localesStore.loadLocale()
    flairsStore.fetchAllFlairs({ save: true })

    onAuthStateChanged(auth, async (user) => {
      try {
        useFirebase.currentUser().value = user
        useFirebase.checkedFirstTime().value = true
        if (user) {
          snackbarStore.createSnack({
            type: SnackType.SUCCESS,
            message: 'stores.user.success.login',
          })
          userStore.getUser(user.uid, { save: true })
          notificationsStore.getMyNotifications({ save: true })
          // If the current route has a redirect, go for It.
          if (route.query.redirect)
            return navigateTo(localePath(route.query.redirect.toString()), { replace: true })
          // If the current route needs you logged out, go to home page.
          if (route.meta.middleware && (route.meta.middleware as MiddlewareKey[]).includes('logged-out'))
            return navigateTo(localePath('/'))
        }
        else {
          userStore.$reset()
          tablesStore.$reset()
          applicationsStore.$reset()
          notificationsStore.$reset()
          // If the current route has a redirect, go for It.
          if (route.query.redirect)
            return navigateTo(localePath(route.query.redirect.toString()), { replace: true })
          // If the current route needs you logged in, go to login page.
          if (route.meta.middleware && (route.meta.middleware as MiddlewareKey[]).includes('logged-in'))
            return navigateTo(localePath({ name: 'login', query: { redirect: route.fullPath } }))
        }
      }
      catch (error) {
        alertsStore.handleError(error)
      }
    })
  })
})
