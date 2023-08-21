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
  APPLICATION_NOT_FOUND = 'APPLICATION_NOT_FOUND',
  USERNAME_TAKEN = 'USERNAME_TAKEN',
  EMAIL_TAKEN = 'EMAIL_TAKEN',
  COULD_NOT_UPLOAD = 'COULD_NOT_UPLOAD',
  TABLES_LIMIT_REACHED = 'TABLES_LIMIT_REACHED',
  APPLICATIONS_LIMIT_REACHED = 'APPLICATIONS_LIMIT_REACHED',
  APPLICATING_TO_SELF = 'APPLICATING_TO_SELF',
  ALREADY_APPLIED_TO_TABLE = 'ALREADY_APPLIED_TO_TABLE',
  INVALID_APPLICATION_STATUS = 'INVALID_APPLICATION_STATUS',
  COULD_NOT_ACCEPT_APPLICATION = 'COULD_NOT_ACCEPT_APPLICATION',
  COULD_NOT_DECLINE_APPLICATION = 'COULD_NOT_DECLINE_APPLICATION',
  NOTIFICATION_NOT_FOUND = 'NOTIFICATION_NOT_FOUND',
}

export type TsoaRequest = Request & { user: DecodedIdToken };

export enum SupportedLanguages {
  EN = 'en',
  PT = 'pt',
}
