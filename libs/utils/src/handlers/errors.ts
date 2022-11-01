import { FirebaseError } from 'firebase-admin';
import { ApiError, ResponseCodes } from '@rpg-together/models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiErrorHandler = (error: any) => {
  if (error instanceof ApiError && error.code !== ResponseCodes.INTERNAL_ERROR) {
    throw error;
  }
  if (error instanceof FirebaseError && error.code !== ResponseCodes.INTERNAL_ERROR) {
    throw new ApiError(ResponseCodes.INTERNAL_ERROR, error?.message ?? error?.details ?? JSON.stringify(error));
  }
  throw new ApiError(ResponseCodes.INTERNAL_ERROR, error?.message ?? error?.details ?? JSON.stringify(error));
};
