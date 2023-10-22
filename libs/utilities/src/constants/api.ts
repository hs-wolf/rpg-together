import type { AvailableRouterMethod, NitroFetchRequest } from 'nitropack'

export const SECURITY_NAME_BEARER = 'Bearer'

interface RequestReturnType {
  path: string
  method: Uppercase<AvailableRouterMethod<NitroFetchRequest>>
}

export const API_ENDPOINTS_REQUESTS = {
  // AUTH REQUESTS
  userRegister: (): RequestReturnType => ({
    path: 'auth/register/user',
    method: 'POST',
  }),
  adminRegister: (): RequestReturnType => ({
    path: 'auth/register/admin',
    method: 'POST',
  }),
  updateAuth: (): RequestReturnType => ({
    path: 'auth/update',
    method: 'PUT',
  }),
  deleteAuth: (): RequestReturnType => ({
    path: 'auth/delete',
    method: 'DELETE',
  }),
  // ANNOUNCEMENT REQUESTS
  createAnnouncement: (): RequestReturnType => ({
    path: 'announcements',
    method: 'POST',
  }),
  getAnnouncement: ({ announcementId }: { announcementId: string }): RequestReturnType => ({
    path: `announcements/${announcementId}`,
    method: 'GET',
  }),
  getAnnouncements: (): RequestReturnType => ({
    path: 'announcements',
    method: 'GET',
  }),
  updateAnnouncement: ({ announcementId }: { announcementId: string }): RequestReturnType => ({
    path: `announcements/${announcementId}`,
    method: 'PUT',
  }),
  deleteAnnouncement: ({ announcementId }: { announcementId: string }): RequestReturnType => ({
    path: `announcements/${announcementId}`,
    method: 'DELETE',
  }),
  // USER REQUESTS
  getUser: ({ userId }: { userId: string }): RequestReturnType => ({
    path: `users/${userId}`,
    method: 'GET',
  }),
  updateUser: (): RequestReturnType => ({
    path: 'users',
    method: 'PUT',
  }),
  // UPLOAD REQUESTS
  uploadUserFile: (): RequestReturnType => ({
    path: 'upload/user-file',
    method: 'POST',
  }),
  uploadTableFile: ({ tableId }: { tableId: string }): RequestReturnType => ({
    path: `upload/table-file/${tableId}`,
    method: 'POST',
  }),
  // TABLE REQUESTS
  createTable: (): RequestReturnType => ({
    path: 'tables',
    method: 'POST',
  }),
  getTablesFromUser: ({ userId }: { userId: string }): RequestReturnType => ({
    path: `tables/from-user/${userId}`,
    method: 'GET',
  }),
  getTable: ({ tableId }: { tableId: string }): RequestReturnType => ({
    path: `tables/${tableId}`,
    method: 'GET',
  }),
  updateTable: ({ tableId }: { tableId: string }): RequestReturnType => ({
    path: `tables/${tableId}`,
    method: 'PUT',
  }),
  deleteTable: ({ tableId }: { tableId: string }): RequestReturnType => ({
    path: `tables/${tableId}`,
    method: 'DELETE',
  }),
  getTableAcceptMessage: ({ tableId }: { tableId: string }): RequestReturnType => ({
    path: `tables/${tableId}/accept-message`,
    method: 'GET',
  }),
  // FLAIR REQUESTS
  createFlair: (): RequestReturnType => ({
    path: 'flairs',
    method: 'POST',
  }),
  getAllFlairs: (): RequestReturnType => ({
    path: 'flairs',
    method: 'GET',
  }),
  getFlair: (): RequestReturnType => ({
    path: 'flairs/{flairId}',
    method: 'GET',
  }),
  updateFlair: (): RequestReturnType => ({
    path: 'flairs/{flairId}',
    method: 'PUT',
  }),
  deleteFlair: (): RequestReturnType => ({
    path: 'flairs/{flairId}',
    method: 'DELETE',
  }),
  // APPLICATION REQUESTS
  createApplication: (): RequestReturnType => ({
    path: 'applications',
    method: 'POST',
  }),
  getApplicationsFromUser: ({
    userId,
  }: {
    userId: string
  }): RequestReturnType => ({
    path: `applications/from-user/${userId}`,
    method: 'GET',
  }),
  getApplicationsFromTable: ({
    tableId,
  }: {
    tableId: string
  }): RequestReturnType => ({
    path: `applications/from-table/${tableId}`,
    method: 'GET',
  }),
  getApplicationFromUserAndTable: ({
    userId,
    tableId,
  }: {
    userId: string
    tableId: string
  }): RequestReturnType => ({
    path: `applications/from-user/${userId}/from-table/${tableId}`,
    method: 'GET',
  }),
  getApplication: ({
    applicationId,
  }: {
    applicationId: string
  }): RequestReturnType => ({
    path: `applications/${applicationId}`,
    method: 'GET',
  }),
  acceptApplication: ({
    applicationId,
  }: {
    applicationId: string
  }): RequestReturnType => ({
    path: `applications/${applicationId}/accept`,
    method: 'POST',
  }),
  declineApplication: ({
    applicationId,
  }: {
    applicationId: string
  }): RequestReturnType => ({
    path: `applications/${applicationId}/decline`,
    method: 'POST',
  }),
  deleteApplication: ({
    applicationId,
  }: {
    applicationId: string
  }): RequestReturnType => ({
    path: `applications/${applicationId}`,
    method: 'DELETE',
  }),
  getApplicationAcceptMessage: ({ applicationId }: { applicationId: string }): RequestReturnType => ({
    path: `applications/${applicationId}/accept-message`,
    method: 'GET',
  }),
  // NOTIFICATION REQUESTS
  getNotificationsFromUser: ({
    userId,
  }: {
    userId: string
  }): RequestReturnType => ({
    path: `notifications/from-user/${userId}`,
    method: 'GET',
  }),
  getNotification: ({
    notificationId,
  }: {
    notificationId: string
  }): RequestReturnType => ({
    path: `notifications/${notificationId}`,
    method: 'GET',
  }),
  readNotification: ({
    notificationId,
  }: {
    notificationId: string
  }): RequestReturnType => ({
    path: `notifications/${notificationId}/read`,
    method: 'POST',
  }),

}
