import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import type { Application, ApplicationCreateBody } from '@rpg-together/models'
import { APPLICATIONS_STORE } from '~/constants'
import { SnackType } from '~/types'
import { useAlertsStore, useSnackbarStore } from '~/stores'

interface IState {
  myApplications: Application[]
  sendingApplication: boolean
  deletingApplication: boolean
  acceptingApplication: boolean
  decliningApplication: boolean
}

export const useApplicationsStore = defineStore(APPLICATIONS_STORE, {
  state: (): IState => ({
    myApplications: [],
    sendingApplication: false,
    deletingApplication: false,
    acceptingApplication: false,
    decliningApplication: false,
  }),
  getters: {},
  actions: {
    async fetchMyApplications(options?: { save: boolean }) {
      const firebaseUser = useFirebase.currentUser().value
      if (!firebaseUser)
        return

      try {
        const applications = await useRpgTogetherAPI.getApplicationsFromUser({ userId: firebaseUser.uid })
        if (options?.save)
          this.myApplications = applications

        return applications
      }
      catch (error) {
        useAlertsStore().handleError(error)
      }
    },
    async getApplicationsFromUser(userId: string) {
      try {
        return await useRpgTogetherAPI.getApplicationsFromUser({ userId })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        return []
      }
    },
    async getApplicationsFromTable(tableId: string) {
      try {
        return await useRpgTogetherAPI.getApplicationsFromTable({ tableId })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        return []
      }
    },
    async getExistingApplication(userId: string, tableId: string) {
      try {
        return await useRpgTogetherAPI.getApplicationFromTableAndUser({ userId, tableId })
      }
      catch (error) {
        useAlertsStore().handleError(error)
      }
    },
    async fetchApplication(applicationId: string) {
      try {
        return await useRpgTogetherAPI.getApplication({ applicationId })
      }
      catch (error) {
        useAlertsStore().handleError(error)
      }
    },
    async sendApplication(values: ApplicationCreateBody) {
      try {
        if (this.sendingApplication)
          return

        this.sendingApplication = true
        await useRpgTogetherAPI.createApplication({ body: values })
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'applications-store.success.create-application',
        })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'applications-store.error.create-application',
        })
        return useAlertsStore().getErrorToShowUser(error)
      }
      finally {
        this.sendingApplication = false
      }
    },
    async acceptApplication(applicationId: string) {
      try {
        if (this.acceptingApplication)
          return
        this.acceptingApplication = true
        await useRpgTogetherAPI.acceptApplication({ applicationId })
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'applications-store.success.accept-application',
        })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'applications-store.error.accept-application',
        })
        return useAlertsStore().getErrorToShowUser(error)
      }
      finally {
        this.acceptingApplication = false
      }
    },
    async declineApplication(applicationId: string) {
      try {
        if (this.decliningApplication)
          return
        this.decliningApplication = true
        await useRpgTogetherAPI.declineApplication({ applicationId })
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'applications-store.success.decline-application',
        })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'applications-store.error.decline-application',
        })
        return useAlertsStore().getErrorToShowUser(error)
      }
      finally {
        this.decliningApplication = false
      }
    },
    async deleteApplication(applicationId: string, password: string) {
      try {
        if (this.deletingApplication)
          return

        const firebaseUser = useFirebase.currentUser().value
        if (!firebaseUser)
          return

        this.deletingApplication = true
        const emailCred = EmailAuthProvider.credential(firebaseUser.email ?? '', password)
        await reauthenticateWithCredential(firebaseUser, emailCred)
        await useRpgTogetherAPI.deleteApplication({ applicationId })
        const applicationIndex = this.myApplications.findIndex(application => application.id === applicationId)
        if (applicationIndex >= 0)
          this.myApplications.splice(applicationIndex, 1)

        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'applications-store.success.delete-application',
        })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'applications-store.error.delete-application',
        })
        return useAlertsStore().getErrorToShowUser(error)
      }
      finally {
        this.deletingApplication = false
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useApplicationsStore, import.meta.hot))
