import type { AvailableRouterMethod, NitroFetchRequest } from 'nitropack';

export const SECURITY_NAME_BEARER = 'Bearer';

type RequestReturnType = { path: string; method: Uppercase<AvailableRouterMethod<NitroFetchRequest>> };

export const API_ENDPOINTS_REQUESTS = {
  // AUTH REQUESTS
  userRegister: (): RequestReturnType => ({
    path: `auth/register/user`,
    method: 'POST',
  }),
  adminRegister: (): RequestReturnType => ({
    path: `auth/register/admin`,
    method: 'POST',
  }),
  updateAuth: (): RequestReturnType => ({
    path: `auth/update`,
    method: 'PUT',
  }),
  deleteAuth: (): RequestReturnType => ({
    path: `auth/delete`,
    method: 'DELETE',
  }),
  // USER REQUESTS
  getUser: ({ userId }: { userId: string }): RequestReturnType => ({
    path: `users/${userId}`,
    method: 'GET',
  }),
  updateUser: (): RequestReturnType => ({
    path: `users`,
    method: 'PUT',
  }),
  // UPLOAD REQUESTS
  uploadUserFile: (): RequestReturnType => ({
    path: `upload/user-file`,
    method: 'POST',
  }),
  uploadTableFile: ({ tableId }: { tableId: string }): RequestReturnType => ({
    path: `upload/table-file/${tableId}`,
    method: 'POST',
  }),
  // TABLE REQUESTS
  createTable: (): RequestReturnType => ({
    path: `flairs`,
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
  // FLAIR REQUESTS
  createFlair: (): RequestReturnType => ({
    path: `flairs`,
    method: 'POST',
  }),
  getAllFlairs: (): RequestReturnType => ({
    path: `flairs`,
    method: 'GET',
  }),
  getFlair: (): RequestReturnType => ({
    path: `flairs/{flairId}`,
    method: 'GET',
  }),
  updateFlair: (): RequestReturnType => ({
    path: `flairs/{flairId}`,
    method: 'PUT',
  }),
  deleteFlair: (): RequestReturnType => ({
    path: `flairs/{flairId}`,
    method: 'DELETE',
  }),
  // APPLICATION REQUESTS
  createApplication: (): RequestReturnType => ({
    path: `applications`,
    method: 'POST',
  }),
  getApplicationsFromUser: ({ userId }: { userId: string }): RequestReturnType => ({
    path: `applications/from-user/${userId}`,
    method: 'GET',
  }),
  getApplicationsFromTable: ({ tableId }: { tableId: string }): RequestReturnType => ({
    path: `applications/from-table/${tableId}`,
    method: 'GET',
  }),
  getApplicationFromUserAndTable: ({ tableId, userId }: { tableId: string; userId: string }): RequestReturnType => ({
    path: `applications/from-table/${tableId}/from-user/${userId}`,
    method: 'GET',
  }),
  getApplication: ({ applicationId }: { applicationId: string }): RequestReturnType => ({
    path: `applications/${applicationId}`,
    method: 'GET',
  }),
  acceptApplication: ({ applicationId }: { applicationId: string }): RequestReturnType => ({
    path: `applications/${applicationId}/accept`,
    method: 'POST',
  }),
  declineApplication: ({ applicationId }: { applicationId: string }): RequestReturnType => ({
    path: `applications/${applicationId}/decline`,
    method: 'POST',
  }),
  deleteApplication: ({ applicationId }: { applicationId: string }): RequestReturnType => ({
    path: `applications/${applicationId}`,
    method: 'DELETE',
  }),
  // NOTIFICATION REQUESTS
  getNotificationsFromUser: ({ userId }: { userId: string }): RequestReturnType => ({
    path: `notifications/from-user/${userId}`,
    method: 'GET',
  }),
  getNotification: ({ notificationId }: { notificationId: string }): RequestReturnType => ({
    path: `notifications/${notificationId}`,
    method: 'GET',
  }),
  readNotification: ({ notificationId }: { notificationId: string }): RequestReturnType => ({
    path: `notifications/${notificationId}/read`,
    method: 'POST',
  }),
};
