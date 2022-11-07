import { ApiError, ResponseCodes } from '@rpg-together/models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiErrorHandler = (error: any) => {
  if (error instanceof ApiError && error.code !== ResponseCodes.INTERNAL_ERROR) {
    throw error;
  }
  throw new ApiError(ResponseCodes.INTERNAL_ERROR, error?.message ?? error?.details ?? JSON.stringify(error));
};
