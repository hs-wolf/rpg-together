import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack';
import { SECURITY_NAME_BEARER, API_ENDPOINTS_REQUESTS } from '@rpg-together/utils';
import { Application, Flair, Table, User } from '@rpg-together/models';

type Options = NitroFetchOptions<NitroFetchRequest>;

export default {
  async customFetch<T>(path: string, options?: Options) {
    const firebaseUser = useFirebase.currentUser();
    const JWT = (await firebaseUser.value?.getIdToken()) || '';
    return $fetch<T>(`${useRuntimeConfig().public.API_URL}${path}`, {
      ...options,
      headers: { Authorization: `${SECURITY_NAME_BEARER} ${JWT}` },
    });
  },
  async register(options?: Options) {
    const fetch = await this.customFetch<void>(`auth/register/user`, {
      ...options,
      method: 'POST',
    });
    return fetch;
  },
  async updateAuthUser(options?: Options) {
    const fetch = await this.customFetch<void>(`auth/update`, {
      ...options,
      method: 'PUT',
    });
    return fetch;
  },
  async accountDelete(options?: Options) {
    const fetch = await this.customFetch<void>(`auth/delete`, {
      ...options,
      method: 'DELETE',
    });
    return fetch;
  },
  async fetchUser(args: { userId: string }, options?: Options) {
    const fetch = await this.customFetch<User>(`users/${args.userId}`, {
      ...options,
      method: 'GET',
    });
    return User.fromMap(fetch);
  },
  async updateUser(options?: Options) {
    const fetch = await this.customFetch<User>(`users`, {
      ...options,
      method: 'PUT',
    });
    return User.fromMap(fetch);
  },
  async uploadUserFile(options?: Options) {
    const fetch = await this.customFetch<string>(`upload/user-file`, {
      ...options,
      method: 'POST',
    });
    return fetch;
  },
  async uploadTableFile(args: { tableId: string }, options?: Options) {
    const fetch = await this.customFetch<string>(`upload/table-file/${args.tableId}`, {
      ...options,
      method: 'POST',
    });
    return fetch;
  },
  async fetchMyTables(args: { userId: string }, options?: Options) {
    const fetch = await this.customFetch<Table[]>(`tables/from-user/${args.userId}`, {
      ...options,
      method: 'GET',
    });
    return fetch.map((table) => Table.fromMap(table));
  },
  async fetchTable(args: { tableId: string }, options?: Options) {
    const fetch = await this.customFetch<Table>(`tables/${args.tableId}`, {
      ...options,
      method: 'GET',
    });
    return Table.fromMap(fetch);
  },
  async createTable(options?: Options) {
    const fetch = await this.customFetch<Table>(`tables`, {
      ...options,
      method: 'POST',
    });
    return Table.fromMap(fetch);
  },
  async updateTable(args: { tableId: string }, options?: Options) {
    const fetch = await this.customFetch<Table>(`tables/${args.tableId}`, {
      ...options,
      method: 'PUT',
    });
    return Table.fromMap(fetch);
  },
  async deleteTable(args: { tableId: string }, options?: Options) {
    const fetch = await this.customFetch<Table>(`tables/${args.tableId}`, {
      ...options,
      method: 'DELETE',
    });
    return Table.fromMap(fetch);
  },
  async fetchAllFlairs(options?: Options) {
    const fetch = await this.customFetch<Flair[]>(`flairs`, {
      ...options,
      method: 'GET',
    });
    return fetch.map((flair) => Flair.fromMap(flair));
  },

  // APPLICATIONS REQUESTS
  async createApplication(options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.createApplication();
    const data = await this.customFetch<Application>(path, {
      ...options,
      method,
    });
    return Application.fromMap(data);
  },
  async getApplication({ applicationId }: { applicationId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getApplication({ applicationId });
    const data = await this.customFetch<Application>(path, {
      ...options,
      method,
    });
    return Application.fromMap(data);
  },
  async getExistingApplication({ tableId, userId }: { tableId: string; userId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getExistingApplication({ tableId, userId });
    const data = await this.customFetch<Application>(path, {
      ...options,
      method,
    });
    return Application.fromMap(data);
  },
  async getApplicationsFromUser({ userId }: { userId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getApplicationsFromUser({ userId });
    const data = await this.customFetch<Application[]>(path, {
      ...options,
      method,
    });
    return data.map((application) => Application.fromMap(application));
  },
  async getApplicationsFromTable({ tableId }: { tableId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.getApplicationsFromTable({ tableId });
    const data = await this.customFetch<Application[]>(path, {
      ...options,
      method,
    });
    return data.map((application) => Application.fromMap(application));
  },
  async deleteApplication({ applicationId }: { applicationId: string }, options?: Options) {
    const { path, method } = API_ENDPOINTS_REQUESTS.deleteApplication({ applicationId });
    await this.customFetch<void>(path, {
      ...options,
      method,
    });
  },
};
