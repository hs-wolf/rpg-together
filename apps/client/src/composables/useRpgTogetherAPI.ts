import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import { API_ENDPOINTS_REQUESTS, SECURITY_NAME_BEARER } from '@rpg-together/utilities'
import { AcceptMessage, Announcement, Application, Flair, Notification, Table, User } from '@rpg-together/models'

type Options = NitroFetchOptions<NitroFetchRequest>

export default {
  async customFetch<T>(path: string, options?: Options) {
    const firebaseUser = useFirebase.currentUser()
    const JWT = (await firebaseUser.value?.getIdToken()) || ''
    return $fetch<T>(`${useRuntimeConfig().public.API_URL}${path}`, {
      ...options,
      headers: { Authorization: `${SECURITY_NAME_BEARER} ${JWT}` },
    })
  },
  // AUTH REQUESTS
  async register(options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.userRegister()
    return this.customFetch<void>(path, {
      ...options,
      method,
    })
  },
  async updateAuthUser(options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.updateAuth()
    return this.customFetch<void>(path, {
      ...options,
      method,
    })
  },
  async deleteAuth(options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.deleteAuth()
    return this.customFetch<void>(path, {
      ...options,
      method,
    })
  },
  async verifyRecaptcha({ token }: { token: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.verifyRecaptcha(token)
    return this.customFetch<void>(path, {
      ...options,
      method,
    })
  },
  // ANNOUNCEMENT REQUESTS
  async createAnnouncement(options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.createAnnouncement()
    const fetch = await this.customFetch<Announcement>(path, {
      ...options,
      method,
    })
    return Announcement.fromMap(fetch)
  },
  async getAnnouncement({ announcementId }: { announcementId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getAnnouncement({ announcementId })
    const fetch = await this.customFetch<Announcement>(path, {
      ...options,
      method,
    })
    return Announcement.fromMap(fetch)
  },
  async getAnnouncements(options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getAnnouncements()
    const fetch = await this.customFetch<Announcement[]>(path, {
      ...options,
      method,
    })
    return fetch.map(announcement => Announcement.fromMap(announcement))
  },
  async updateAnnouncement({ announcementId }: { announcementId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.updateAnnouncement({ announcementId })
    const fetch = await this.customFetch<Announcement>(path, {
      ...options,
      method,
    })
    return Announcement.fromMap(fetch)
  },
  async deleteAnnouncement({ announcementId }: { announcementId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.deleteAnnouncement({ announcementId })
    const fetch = await this.customFetch<Announcement>(path, {
      ...options,
      method,
    })
    return Announcement.fromMap(fetch)
  },
  // USER REQUESTS
  async getUser({ userId }: { userId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getUser({ userId })
    const fetch = await this.customFetch<User>(path, {
      ...options,
      method,
    })
    return User.fromMap(fetch)
  },
  async updateUser(options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.updateUser()
    const fetch = await this.customFetch<User>(path, {
      ...options,
      method,
    })
    return User.fromMap(fetch)
  },
  // UPLOAD REQUESTS
  async uploadUserFile(options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.uploadUserFile()
    const fetch = await this.customFetch<string>(path, {
      ...options,
      method,
    })
    return fetch
  },
  async uploadTableFile({ tableId }: { tableId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.uploadTableFile({ tableId })
    const fetch = await this.customFetch<string>(path, {
      ...options,
      method,
    })
    return fetch
  },
  // TABLE REQUESTS
  async createTable(options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.createTable()
    const fetch = await this.customFetch<Table>(path, {
      ...options,
      method,
    })
    return Table.fromMap(fetch)
  },
  async getTable({ tableId }: { tableId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getTable({ tableId })
    const fetch = await this.customFetch<Table>(path, {
      ...options,
      method,
    })
    return Table.fromMap(fetch)
  },
  async getUserTables({ userId }: { userId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getTablesFromUser({ userId })
    const fetch = await this.customFetch<Table[]>(path, {
      ...options,
      method,
    })
    return fetch.map(table => Table.fromMap(table))
  },
  async updateTable({ tableId }: { tableId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.updateTable({ tableId })
    const fetch = await this.customFetch<Table>(path, {
      ...options,
      method,
    })
    return Table.fromMap(fetch)
  },
  async deleteTable({ tableId }: { tableId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.deleteTable({ tableId })
    const fetch = await this.customFetch<Table>(path, {
      ...options,
      method,
    })
    return Table.fromMap(fetch)
  },
  async getTableAcceptMessage({ tableId }: { tableId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getTableAcceptMessage({ tableId })
    const fetch = await this.customFetch<AcceptMessage>(path, {
      ...options,
      method,
    })
    return AcceptMessage.fromMap(fetch)
  },
  // FLAIR REQUESTS
  async fetchAllFlairs(options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getAllFlairs()
    const fetch = await this.customFetch<Flair[]>(path, {
      ...options,
      method,
    })
    return fetch.map(flair => Flair.fromMap(flair))
  },
  // APPLICATION REQUESTS
  async createApplication(options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.createApplication()
    const data = await this.customFetch<Application>(path, {
      ...options,
      method,
    })
    return Application.fromMap(data)
  },
  async getApplication({ applicationId }: { applicationId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getApplication({ applicationId })
    const data = await this.customFetch<Application>(path, {
      ...options,
      method,
    })
    return Application.fromMap(data)
  },
  async getApplicationFromTableAndUser({ userId, tableId }: { userId: string; tableId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getApplicationFromUserAndTable({ userId, tableId })
    const data = await this.customFetch<Application>(path, {
      ...options,
      method,
    })
    return Application.fromMap(data)
  },
  async getApplicationsFromUser({ userId }: { userId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getApplicationsFromUser({ userId })
    const data = await this.customFetch<Application[]>(path, {
      ...options,
      method,
    })
    return data.map(application => Application.fromMap(application)) as Application[]
  },
  async getApplicationsFromTable({ tableId }: { tableId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getApplicationsFromTable({ tableId })
    const data = await this.customFetch<Application[]>(path, {
      ...options,
      method,
    })
    return data.map(application => Application.fromMap(application)) as Application[]
  },
  async acceptApplication({ applicationId }: { applicationId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.acceptApplication({ applicationId })
    return this.customFetch<void>(path, {
      ...options,
      method,
    })
  },
  async declineApplication({ applicationId }: { applicationId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.declineApplication({ applicationId })
    return this.customFetch<void>(path, {
      ...options,
      method,
    })
  },
  async deleteApplication({ applicationId }: { applicationId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.deleteApplication({ applicationId })
    return this.customFetch<void>(path, {
      ...options,
      method,
    })
  },
  async getApplicationAcceptMessage({ applicationId }: { applicationId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getApplicationAcceptMessage({ applicationId })
    const fetch = await this.customFetch<AcceptMessage>(path, {
      ...options,
      method,
    })
    return AcceptMessage.fromMap(fetch)
  },
  // NOTIFICATION REQUESTS
  async getNotificationsFromUser({ userId }: { userId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getNotificationsFromUser({ userId })
    const data = await this.customFetch<Notification[]>(path, {
      ...options,
      method,
    })
    return data.map(notification => Notification.fromMap(notification)) as Notification[]
  },
  async getNotification({ notificationId }: { notificationId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getNotification({ notificationId })
    const data = await this.customFetch<Notification>(path, {
      ...options,
      method,
    })
    return Notification.fromMap(data)
  },
  async readNotification({ notificationId }: { notificationId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.readNotification({ notificationId })
    return this.customFetch<void>(path, {
      ...options,
      method,
    })
  },
}
