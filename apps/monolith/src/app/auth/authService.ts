import { Inject, Singleton } from 'typescript-ioc'
import type {
  AuthUserRegisterBody,
  AuthUserUpdateBody,
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
import type { UsersService } from '../users/usersService'

@Singleton
export class AuthService {
  constructor(authRepo: IAuthRepository) {
    this._authRepo = authRepo ?? new AuthRepositoryFirebase()
  }

  private _authRepo: IAuthRepository

  @Inject
  private usersService: UsersService

  async userRegister(body: AuthUserRegisterBody): Promise<void> {
    try {
      await this.usersService.checkUsernameExists(body.username)
      const newUser = await this.usersService.createUser({
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
      await this.usersService.checkUsernameExists(body.username)
      const newUser = await this.usersService.createUser({
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
        await this.usersService.updateUser(userId, { email: body.email })
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
      await this.usersService.deleteUser(userId)
      await this._authRepo.deleteAuthUser(userId)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }
}
