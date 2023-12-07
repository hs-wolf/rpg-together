import process from 'node:process'
import type {
  AuthUserRegisterBody,
  AuthUserUpdateBody,
  RecaptchaVerificationResponse,
} from '@rpg-together/models'
import {
  ApiError,
  ResponseCodes,
  ResponseMessages,
  TokenClaims,
  UserRoles,
} from '@rpg-together/models'
import type { IAuthRepository } from '@rpg-together/repositories'
import {
  AuthRepositoryFirebase,
} from '@rpg-together/repositories'
import { DEFAULT_USER_AVATAR, apiErrorHandler } from '@rpg-together/utilities'
import { UsersService } from '../users/usersService'

export class AuthService {
  constructor(authRepo?: IAuthRepository) {
    this._authRepo = authRepo ?? new AuthRepositoryFirebase()
  }

  private _authRepo: IAuthRepository

  async userRegister(body: AuthUserRegisterBody): Promise<void> {
    try {
      await this.recaptchaVerify(body.recaptcha_token)
      await new UsersService().checkUserExists(body.username, body.email)
      const newUser = await new UsersService().createUser({
        role: UserRoles.USER,
        username: body.username,
        email: body.email,
        avatar: DEFAULT_USER_AVATAR,
      })
      await this._authRepo.createAuthUserWithEmailAndPassword({
        uid: newUser.id,
        email: body.email,
        password: body.password,
      })
      await this._authRepo.setAuthUserClaims(
        newUser.id,
        new TokenClaims(UserRoles.USER),
      )
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async adminRegister(body: AuthUserRegisterBody): Promise<void> {
    try {
      await this.recaptchaVerify(body.recaptcha_token)
      await new UsersService().checkUserExists(body.username, body.email)
      const newUser = await new UsersService().createUser({
        role: UserRoles.ADMIN,
        username: body.username,
        email: body.email,
        avatar: DEFAULT_USER_AVATAR,
      })
      await this._authRepo.createAuthUserWithEmailAndPassword({
        uid: newUser.id,
        email: body.email,
        password: body.password,
      })
      await this._authRepo.setAuthUserClaims(
        newUser.id,
        new TokenClaims(UserRoles.ADMIN),
      )
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async updateAuthUser(
    userId: string,
    body: AuthUserUpdateBody,
  ): Promise<void> {
    try {
      if (body.email) {
        const userRecord = await this._authRepo.getAuthUserByEmail(body.email)
        if (userRecord) {
          throw new ApiError(
            ResponseCodes.BAD_REQUEST,
            ResponseMessages.EMAIL_TAKEN,
          )
        }
        await this._authRepo.updateAuthUser(userId, { email: body.email })
        await new UsersService().updateUser(userId, { email: body.email })
      }
      if (body.password) {
        await this._authRepo.updateAuthUser(userId, {
          password: body.password,
        })
      }
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteAuthUser(userId: string): Promise<void> {
    try {
      await new UsersService().deleteUser(userId)
      await this._authRepo.deleteAuthUser(userId)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async recaptchaVerify(token: string): Promise<void> {
    try {
      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_VERIFY_KEY}&response=${token}`
      const response = await fetch(url, { method: 'POST' })
      const data = await response.json() as RecaptchaVerificationResponse
      if (!data.success) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.RECAPTCHA_TOKEN_INVALID,
        )
      }
      if (data.score < 0.5) {
        throw new ApiError(
          ResponseCodes.UNAUTHORIZED,
          ResponseMessages.RECAPTCHA_SCORE_TOO_LOW,
        )
      }
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }
}
