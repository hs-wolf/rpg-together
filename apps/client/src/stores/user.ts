import { EmailAuthProvider, reauthenticateWithCredential, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { load } from 'recaptcha-v3'
import type { AuthUserRegisterBody, AuthUserUpdateBody, User, UserUpdateBody } from '@rpg-together/models'
import { USER_STORE } from '~/constants'
import { SnackType } from '~/types'
import { useAlertsStore, useSnackbarStore } from '~/stores'

interface IState {
  user: User | null
  signingIn: boolean
  signingOut: boolean
  registering: boolean
  changingAuthData: boolean
  deletingAccount: boolean
  changingUsername: boolean
  changingAvatar: boolean
}

export const useUserStore = defineStore(USER_STORE, {
  state: (): IState => ({
    user: null,
    signingIn: false,
    signingOut: false,
    registering: false,
    changingAuthData: false,
    deletingAccount: false,
    changingUsername: false,
    changingAvatar: false,
  }),
  getters: {},
  actions: {
    async signIn(email: string, password: string) {
      try {
        if (this.signingIn)
          return
        const firebaseAuth = useFirebase.firebaseAuth().value
        if (!firebaseAuth)
          return
        this.signingIn = true
        const recaptchaToken = await this.getRecaptchaToken()
        await useRpgTogetherAPI.verifyRecaptcha({ token: recaptchaToken ?? '' })
        await signInWithEmailAndPassword(firebaseAuth, email, password)
      }
      catch (error) {
        const alertsStore = useAlertsStore()
        alertsStore.handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'stores.user.error.login',
        })
        return alertsStore.getErrorToShowUser(error)
      }
      finally {
        this.signingIn = false
      }
    },
    async signOut() {
      try {
        if (this.signingOut)
          return
        const firebaseAuth = useFirebase.firebaseAuth().value
        if (!firebaseAuth)
          return
        this.signingOut = true
        await signOut(firebaseAuth)
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'stores.user.success.logout',
        })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'stores.user.error.logout',
        })
      }
      finally {
        this.signingOut = false
      }
    },
    async register(body: AuthUserRegisterBody) {
      try {
        if (this.registering)
          return
        this.registering = true
        const newBody = body
        newBody.recaptcha_token = await this.getRecaptchaToken()
        await useRpgTogetherAPI.register({ body: newBody })
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'stores.user.success.register',
        })
        await this.signIn(body.email, body.password)
      }
      catch (error) {
        const alertsStore = useAlertsStore()
        alertsStore.handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'stores.user.error.register',
        })
        return alertsStore.getErrorToShowUser(error)
      }
      finally {
        this.registering = false
      }
    },
    async changeAuthData(values: { password: string; newEmail?: string; newPassword?: string }) {
      if (this.changingAuthData)
        return

      const firebaseUser = useFirebase.currentUser().value
      if (!firebaseUser)
        return

      try {
        this.changingAuthData = true
        const emailCred = EmailAuthProvider.credential(firebaseUser.email ?? '', values.password)
        await reauthenticateWithCredential(firebaseUser, emailCred)
        const body: AuthUserUpdateBody = {
          password: values.newPassword,
          email: values.newEmail,
        }
        await useRpgTogetherAPI.updateAuthUser({ body })
        const newUser = await useRpgTogetherAPI.updateUser({
          body: { email: values.newEmail ?? firebaseUser.email ?? '' },
        })
        this.user = newUser
        await this.signIn(values.newEmail ?? firebaseUser.email ?? '', values.newPassword ?? values.password)
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'stores.user.success.change-auth-data',
        })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'stores.user.error.change-auth-data',
        })
        return useAlertsStore().getErrorToShowUser(error)
      }
      finally {
        this.changingAuthData = false
      }
    },
    async deleteAuth(password: string) {
      if (this.deletingAccount)
        return

      const firebaseUser = useFirebase.currentUser().value
      if (!firebaseUser)
        return

      try {
        this.deletingAccount = true
        const emailCred = EmailAuthProvider.credential(firebaseUser.email ?? '', password)
        await reauthenticateWithCredential(firebaseUser, emailCred)
        await useRpgTogetherAPI.deleteAuth()
        await this.signOut()
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'stores.user.success.account-delete',
        })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'stores.user.error.account-delete',
        })
        return useAlertsStore().getErrorToShowUser(error)
      }
      finally {
        this.deletingAccount = false
      }
    },
    async getUser(userId: string, options?: { save?: boolean }) {
      try {
        const user = await useRpgTogetherAPI.getUser({ userId })
        if (options?.save)
          this.user = user

        return user
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'stores.user.error.fetch-user',
        })
        return null
      }
    },
    async changeUsername(values: { username: string; password: string }) {
      if (this.changingUsername)
        return

      const firebaseUser = useFirebase.currentUser().value
      if (!firebaseUser)
        return

      try {
        this.changingUsername = true
        const emailCred = EmailAuthProvider.credential(firebaseUser.email ?? '', values.password)
        await reauthenticateWithCredential(firebaseUser, emailCred)
        const body: UserUpdateBody = {
          username: values.username,
        }
        const newUser = await useRpgTogetherAPI.updateUser({ body })
        this.user = newUser
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'stores.user.success.change-username',
        })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'stores.user.error.change-username',
        })
        return useAlertsStore().getErrorToShowUser(error)
      }
      finally {
        this.changingUsername = false
      }
    },
    async changeAvatar(file: File) {
      if (this.changingAvatar)
        return

      try {
        this.changingAvatar = true
        const formData = new FormData()
        formData.append('file', file)
        const url = await useRpgTogetherAPI.uploadUserFile({ body: formData })
        const body: UserUpdateBody = {
          avatar: url,
        }
        const newUser = await useRpgTogetherAPI.updateUser({ body })
        this.user = newUser
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'stores.user.success.change-avatar',
        })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'stores.user.error.change-avatar',
        })
      }
      finally {
        this.changingAvatar = false
      }
    },
    async getRecaptchaToken() {
      try {
        const recaptcha = await load(useRuntimeConfig().public.RECAPTCHA)
        const token = await recaptcha.execute('register')
        return token
      }
      catch (error) {
        useAlertsStore().handleError(error)
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
