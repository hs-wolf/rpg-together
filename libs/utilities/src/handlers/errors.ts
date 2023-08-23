import { ApiError, ResponseCodes } from '@rpg-together/models'

export function apiErrorHandler(error: any) {
  if (error instanceof ApiError && error.code !== ResponseCodes.INTERNAL_ERROR)
    throw error

  throw new ApiError(ResponseCodes.INTERNAL_ERROR, error?.message ?? error?.details ?? JSON.stringify(error))
}
