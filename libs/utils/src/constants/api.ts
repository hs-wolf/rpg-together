import type { AvailableRouterMethod, NitroFetchRequest } from 'nitropack';

export const SECURITY_NAME_BEARER = 'Bearer';

type RequestReturnType = { path: string; method: Uppercase<AvailableRouterMethod<NitroFetchRequest>> };

export const API_ENDPOINTS_REQUESTS = {
  // APPLICATIONS REQUESTS
  createApplication: (): RequestReturnType => ({
    path: `applications`,
    method: 'POST',
  }),
  getApplication: ({ applicationId }: { applicationId: string }): RequestReturnType => ({
    path: `applications/${applicationId}`,
    method: 'GET',
  }),
  getExistingApplication: ({ tableId, userId }: { tableId: string; userId: string }): RequestReturnType => ({
    path: `applications/existing/${tableId}/${userId}`,
    method: 'GET',
  }),
  getApplicationsFromUser: ({ userId }: { userId: string }): RequestReturnType => ({
    path: `applications/from-user/${userId}`,
    method: 'GET',
  }),
  getApplicationsFromTable: ({ tableId }: { tableId: string }): RequestReturnType => ({
    path: `applications/from-table/${tableId}`,
    method: 'GET',
  }),
  deleteApplication: ({ applicationId }: { applicationId: string }): RequestReturnType => ({
    path: `applications/${applicationId}`,
    method: 'DELETE',
  }),
};
