import { Request } from 'express';
import { auth } from 'firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';
import { ApiError, ResponseCodes, ResponseMessages } from '@rpg-together/models';
import { SECURITY_NAME_BEARER, apiErrorHandler } from '@rpg-together/utils';

/**
 * This is called by tsoa's auto generated routes.
 * @param request - The request object sent by express.
 * @param securityName - The security name sent by the controller.
 * @param scopes - The array of scopes sent by the controller.
 * @returns {Promise<DecodedIdToken | undefined>} The decoded token from `bearerAuth` function or undefined.
 */
export const expressAuthentication = async (
  request: Request,
  securityName: string,
  scopes: string[]
): Promise<DecodedIdToken | undefined> => {
  if (securityName === SECURITY_NAME_BEARER) {
    return bearerAuth(request, scopes);
  }
};

/**
 * Scan the `request` token locations and get the first existing one.
 * Remove the `Bearer` prefix from the token and return it verified and decoded.
 * @param {Request} request - The request object sent by express.
 * @param {string[]} scopes - The array of scopes sent by the controller.
 * @return {Promise<DecodedIdToken>} The decoded token from firebase.
 */
const bearerAuth = async (request: Request, scopes: string[]): Promise<DecodedIdToken> => {
  try {
    const rawToken: string =
      request.body.token || request.query.token || request.headers['x-access-token'] || request.get('Authorization');
    const cleanToken = rawToken ? rawToken.replace(`${SECURITY_NAME_BEARER} `, '') : '';
    if (!cleanToken) {
      throw new ApiError(ResponseCodes.UNAUTHORIZED, ResponseMessages.MISSING_TOKEN);
    }
    const claims = await auth().verifyIdToken(cleanToken);
    if (scopes.length && !scopes.includes(claims.role)) {
      throw new ApiError(ResponseCodes.UNAUTHORIZED, ResponseMessages.ROLE_NOT_AUTHORIZED);
    }
    return claims;
  } catch (error) {
    return apiErrorHandler(error);
  }
};
