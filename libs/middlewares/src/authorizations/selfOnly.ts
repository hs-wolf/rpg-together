import type { TsoaRequest } from '@rpg-together/models'
import {
  ApiError,
  ResponseCodes,
  ResponseMessages,
} from '@rpg-together/models'

export function selfOnly(request: TsoaRequest, userId: string) {
  if (request.user.uid !== userId) {
    throw new ApiError(
      ResponseCodes.UNAUTHORIZED,
      ResponseMessages.NOT_OWNER_OF_CONTENT,
    )
  }
}
