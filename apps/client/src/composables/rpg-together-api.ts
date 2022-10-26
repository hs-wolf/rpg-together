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
    return useFetch<T>(`${useRuntimeConfig().public.BASE_URL}${path}`, finalOptions);
  },
  async fetchUser(args: { userId: string }, options?: FetchOptions) {
    const fetch = await this.customFetch<User>(`users/${args.userId}`, {
      ...options,
      method: 'GET',
    });
    return fetch;
  },
};
