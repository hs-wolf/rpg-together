import { Request } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';

export class ApiError {
  constructor(public code: ResponseCodes, public message: string, public status?: number) {}

  toMap() {
    return {
      code: this.code,
      message: this.message,
      status: this.status,
    };
  }
}

export enum ResponseCodes {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

export enum ResponseMessages {
  MISSING_TOKEN = 'MISSING_TOKEN',
  ROLE_NOT_AUTHORIZED = 'ROLE_NOT_AUTHORIZED',
  NOT_OWNER_OF_CONTENT = 'NOT_OWNER_OF_CONTENT',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  TABLE_NOT_FOUND = 'TABLE_NOT_FOUND',
  FLAIR_NOT_FOUND = 'FLAIR_NOT_FOUND',
  USERNAME_TAKEN = 'USERNAME_TAKEN',
  EMAIL_TAKEN = 'EMAIL_TAKEN',
  COULD_NOT_UPLOAD = 'COULD_NOT_UPLOAD',
  TABLES_LIMIT_REACHED = 'TABLES_LIMIT_REACHED',
}

export type TsoaRequest = Request & { user: DecodedIdToken };
