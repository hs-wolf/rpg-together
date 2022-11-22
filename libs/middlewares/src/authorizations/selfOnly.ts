import { ApiError, ResponseCodes, ResponseMessages, TsoaRequest } from '@rpg-together/models';

export const selfOnly = (request: TsoaRequest, userId: string) => {
  if (request.user.uid !== userId) {
    throw new ApiError(ResponseCodes.UNAUTHORIZED, ResponseMessages.NOT_OWNER_OF_CONTENT);
  }
};
