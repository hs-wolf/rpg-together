import { FetchOptions } from 'ohmyfetch';
import { SECURITY_NAME_BEARER } from '@rpg-together/utils';
import { User } from '@rpg-together/models';

export const useRpgTogetherAPI = {
  async customFetch<T>(path: string, options?: FetchOptions) {
    const nuxtApp = useNuxtApp();
    const token = (await nuxtApp.$firebaseAuth.currentUser?.getIdToken()) || '';
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
  async fetchUser(args: { userId: string }, options?: FetchOptions) {
    const fetch = await this.customFetch<User>(`users/${args.userId}`, {
      ...options,
      method: 'GET',
    });
    return fetch;
  },
};
