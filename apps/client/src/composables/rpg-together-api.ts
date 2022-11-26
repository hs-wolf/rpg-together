import { FetchOptions } from 'ohmyfetch';
import { SECURITY_NAME_BEARER } from '@rpg-together/utils';
import { Flair, Table, User } from '@rpg-together/models';

export const useRpgTogetherAPI = {
  async customFetch<T>(path: string, options?: FetchOptions) {
    const firebaseUser = useFirebase.user();
    const token = (await firebaseUser.value?.getIdToken()) || '';
    const finalOptions = {
      ...options,
      headers: { Authorization: `${SECURITY_NAME_BEARER} ${token}` },
    };
    return $fetch<T>(`${useRuntimeConfig().public.BASE_URL}${path}`, finalOptions);
  },
  async register(options?: FetchOptions) {
    const fetch = await this.customFetch<void>(`auth/register/user`, {
      ...options,
      method: 'POST',
    });
    return fetch;
  },
  async updateAuthUser(options?: FetchOptions) {
    const fetch = await this.customFetch<void>(`auth/update`, {
      ...options,
      method: 'PUT',
    });
    return fetch;
  },
  async accountDelete(options?: FetchOptions) {
    const fetch = await this.customFetch<void>(`auth/delete`, {
      ...options,
      method: 'DELETE',
    });
    return fetch;
  },
  async fetchUser(args: { userId: string }, options?: FetchOptions) {
    const fetch = await this.customFetch<User>(`users/${args.userId}`, {
      ...options,
      method: 'GET',
    });
    return User.fromMap(fetch);
  },
  async updateUser(options?: FetchOptions) {
    const fetch = await this.customFetch<User>(`users`, {
      ...options,
      method: 'PUT',
    });
    return User.fromMap(fetch);
  },
  async uploadUserFile(options?: FetchOptions) {
    const fetch = await this.customFetch<string>(`upload/user-file`, {
      ...options,
      method: 'POST',
    });
    return fetch;
  },
  async uploadTableFile(args: { tableId: string }, options?: FetchOptions) {
    const fetch = await this.customFetch<string>(`upload/table-file/${args.tableId}`, {
      ...options,
      method: 'POST',
    });
    return fetch;
  },
  async fetchMyTables(args: { userId: string }, options?: FetchOptions) {
    const fetch = await this.customFetch<Table[]>(`tables/from-user/${args.userId}`, {
      ...options,
      method: 'GET',
    });
    return fetch.map((table) => Table.fromMap(table));
  },
  async createTable(options?: FetchOptions) {
    const fetch = await this.customFetch<Table>(`tables`, {
      ...options,
      method: 'POST',
    });
    return Table.fromMap(fetch);
  },
  async updateTable(args: { tableId: string }, options?: FetchOptions) {
    const fetch = await this.customFetch<Table>(`tables/${args.tableId}`, {
      ...options,
      method: 'PUT',
    });
    return Table.fromMap(fetch);
  },
  async getAllFlairs(options?: FetchOptions) {
    const fetch = await this.customFetch<Flair[]>(`flairs`, {
      ...options,
      method: 'GET',
    });
    return fetch.map((flair) => Flair.fromMap(flair));
  },
};
