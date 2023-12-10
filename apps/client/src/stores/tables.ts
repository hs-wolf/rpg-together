import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import type { Table, TableCreateBody, TableUpdateBody } from '@rpg-together/models'
import { DEFAULT_TABLE_BANNER } from '@rpg-together/utilities'
import { TABLES_STORE } from '~/constants'
import { SnackType } from '~/types'
import { useAlertsStore, useSnackbarStore } from '~/stores'

interface IState {
  myTables: Table[]
  fetchingMyTables: boolean
  creatingTable: boolean
  updatingTable: boolean
  deletingTable: boolean
}

export const useTablesStore = defineStore(TABLES_STORE, {
  state: (): IState => ({
    myTables: [],
    fetchingMyTables: false,
    creatingTable: false,
    updatingTable: false,
    deletingTable: false,
  }),
  getters: {},
  actions: {
    async getUserTables(options?: { save: boolean }) {
      if (this.fetchingMyTables)
        return
      const firebaseUser = useFirebase.currentUser().value
      if (!firebaseUser)
        return
      try {
        this.fetchingMyTables = true
        const tables = await useRpgTogetherAPI.getUserTables({ userId: firebaseUser.uid })
        if (options?.save)
          this.myTables = tables

        return tables
      }
      catch (error) {
        useAlertsStore().handleError(error)
      }
      finally {
        this.fetchingMyTables = false
      }
    },
    async getTable(tableId: string) {
      try {
        return await useRpgTogetherAPI.getTable({ tableId })
      }
      catch (error) {
        useAlertsStore().handleError(error)
      }
    },
    async createTable(values: TableCreateBody, bannerFile?: File) {
      if (this.creatingTable)
        return

      try {
        this.creatingTable = true
        const body: TableCreateBody = {
          ...values,
          banner: DEFAULT_TABLE_BANNER,
        }
        const table = await useRpgTogetherAPI.createTable({ body })
        this.myTables.push(table)
        if (bannerFile)
          await this.updateTable(table.id, { ...values }, bannerFile)

        const localeRoute = useLocaleRoute()
        navigateTo(localeRoute({ name: 'my-tables' }))
        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'stores.tables.success.create-table',
        })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'stores.tables.error.create-table',
        })
        return useAlertsStore().getErrorToShowUser(error)
      }
      finally {
        this.creatingTable = false
      }
    },
    async updateTable(tableId: string, values: TableUpdateBody, bannerFile?: File) {
      if (this.updatingTable)
        return

      try {
        this.updatingTable = true
        const body: TableUpdateBody = {
          ...values,
        }
        if (bannerFile) {
          const formData = new FormData()
          formData.append('file', bannerFile)
          const url = await useRpgTogetherAPI.uploadTableFile({ tableId }, { body: formData })
          body.banner = url
        }
        const table = await useRpgTogetherAPI.updateTable({ tableId }, { body })
        const tableIndex = this.myTables.findIndex(table => table.id === tableId)
        if (tableIndex >= 0)
          this.myTables[tableIndex] = table

        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'stores.tables.success.update-table',
        })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'stores.tables.error.update-table',
        })
        return useAlertsStore().getErrorToShowUser(error)
      }
      finally {
        this.updatingTable = false
      }
    },
    async deleteTable(tableId: string, password: string) {
      if (this.deletingTable)
        return

      const firebaseUser = useFirebase.currentUser().value
      if (!firebaseUser)
        return

      try {
        this.deletingTable = true
        const emailCred = EmailAuthProvider.credential(firebaseUser.email ?? '', password)
        await reauthenticateWithCredential(firebaseUser, emailCred)
        await useRpgTogetherAPI.deleteTable({ tableId })
        const tableIndex = this.myTables.findIndex(table => table.id === tableId)
        if (tableIndex >= 0)
          this.myTables.splice(tableIndex, 1)

        useSnackbarStore().createSnack({
          type: SnackType.SUCCESS,
          message: 'stores.tables.success.delete-table',
        })
      }
      catch (error) {
        useAlertsStore().handleError(error)
        useSnackbarStore().createSnack({
          type: SnackType.ERROR,
          message: 'stores.tables.error.delete-table',
        })
        return useAlertsStore().getErrorToShowUser(error)
      }
      finally {
        this.deletingTable = false
      }
    },
  },
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTablesStore, import.meta.hot))
