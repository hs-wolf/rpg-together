import { SECURITY_NAME_BEARER } from '@rpg-together/utils';
import { Application, Flair, Table, User } from '@rpg-together/models';

export default {
  async customFetch<T>(path: string, options?: any) {
    const firebaseUser = useFirebase.currentUser();
    const token = (await firebaseUser.value?.getIdToken()) || '';
    const finalOptions = {
      ...options,
      headers: { Authorization: `${SECURITY_NAME_BEARER} ${token}` },
    };
    return $fetch<T>(`${useRuntimeConfig().public.API_URL}${path}`, finalOptions);
  },
  async register(options?: any) {
    const fetch = await this.customFetch<void>(`auth/register/user`, {
      ...options,
      method: 'POST',
    });
    return fetch;
  },
  async updateAuthUser(options?: any) {
    const fetch = await this.customFetch<void>(`auth/update`, {
      ...options,
      method: 'PUT',
    });
    return fetch;
  },
  async accountDelete(options?: any) {
    const fetch = await this.customFetch<void>(`auth/delete`, {
      ...options,
      method: 'DELETE',
    });
    return fetch;
  },
  async fetchUser(args: { userId: string }, options?: any) {
    const fetch = await this.customFetch<User>(`users/${args.userId}`, {
      ...options,
      method: 'GET',
    });
    return User.fromMap(fetch);
  },
  async updateUser(options?: any) {
    const fetch = await this.customFetch<User>(`users`, {
      ...options,
      method: 'PUT',
    });
    return User.fromMap(fetch);
  },
  async uploadUserFile(options?: any) {
    const fetch = await this.customFetch<string>(`upload/user-file`, {
      ...options,
      method: 'POST',
    });
    return fetch;
  },
  async uploadTableFile(args: { tableId: string }, options?: any) {
    const fetch = await this.customFetch<string>(`upload/table-file/${args.tableId}`, {
      ...options,
      method: 'POST',
    });
    return fetch;
  },
  async fetchMyTables(args: { userId: string }, options?: any) {
    const fetch = await this.customFetch<Table[]>(`tables/from-user/${args.userId}`, {
      ...options,
      method: 'GET',
    });
    return fetch.map((table) => Table.fromMap(table));
  },
  async fetchTable(args: { tableId: string }, options?: any) {
    const fetch = await this.customFetch<Table>(`tables/${args.tableId}`, {
      ...options,
      method: 'GET',
    });
    return Table.fromMap(fetch);
  },
  async createTable(options?: any) {
    const fetch = await this.customFetch<Table>(`tables`, {
      ...options,
      method: 'POST',
    });
    return Table.fromMap(fetch);
  },
  async updateTable(args: { tableId: string }, options?: any) {
    const fetch = await this.customFetch<Table>(`tables/${args.tableId}`, {
      ...options,
      method: 'PUT',
    });
    return Table.fromMap(fetch);
  },
  async deleteTable(args: { tableId: string }, options?: any) {
    const fetch = await this.customFetch<Table>(`tables/${args.tableId}`, {
      ...options,
      method: 'DELETE',
    });
    return Table.fromMap(fetch);
  },
  async fetchAllFlairs(options?: any) {
    const fetch = await this.customFetch<Flair[]>(`flairs`, {
      ...options,
      method: 'GET',
    });
    return fetch.map((flair) => Flair.fromMap(flair));
  },
  async getExistingApplication(args: { tableId: string; userId: string }, options?: any) {
    const fetch = await this.customFetch<Application[]>(`applications/existing/${args.tableId}/${args.userId}`, {
      ...options,
      method: 'GET',
    });
    return fetch.map((application) => Application.fromMap(application));
  },
  async getApplicationsFromUser(args: { userId: string }, options?: any) {
    const fetch = await this.customFetch<Application[]>(`applications/from-user/${args.userId}`, {
      ...options,
      method: 'GET',
    });
    return fetch.map((application) => Application.fromMap(application));
  },
  async getApplicationsFromTable(args: { tableId: string }, options?: any) {
    const fetch = await this.customFetch<Application[]>(`applications/from-table/${args.tableId}`, {
      ...options,
      method: 'GET',
    });
    return fetch.map((application) => Application.fromMap(application));
  },
  async getApplication(args: { applicationId: string }, options?: any) {
    const fetch = await this.customFetch<Application>(`applications/${args.applicationId}`, {
      ...options,
      method: 'GET',
    });
    return Application.fromMap(fetch);
  },
  async createApplication(options?: any) {
    const fetch = await this.customFetch<Application>(`applications`, {
      ...options,
      method: 'POST',
    });
    return Application.fromMap(fetch);
  },
  async deleteApplication(args: { applicationId: string }, options?: any) {
    await this.customFetch<Application>(`applications/${args.applicationId}`, {
      ...options,
      method: 'DELETE',
    });
  },
};
