import { Inject, Singleton } from 'typescript-ioc';
import {
  TokenClaims,
  AuthUserRegisterBody,
  UserRoles,
  AuthUserUpdateBody,
  ApiError,
  ResponseCodes,
  ResponseMessages,
} from '@rpg-together/models';
import { IAuthRepository, AuthRepositoryFirebase } from '@rpg-together/repos';
import { apiErrorHandler, DEFAULT_USER_AVATAR } from '@rpg-together/utils';
import { UsersService } from '../users/usersService';

@Singleton
export class AuthService {
  constructor(authRepo: IAuthRepository) {
    this._authRepo = authRepo ?? new AuthRepositoryFirebase();
  }

  private _authRepo: IAuthRepository;

  @Inject
  private usersService: UsersService;

  async userRegister(body: AuthUserRegisterBody): Promise<void> {
    try {
      await this.usersService.checkUsernameExists(body.username);
      const newUser = await this.usersService.createUser({
        role: UserRoles.USER,
        username: body.username,
        email: body.email,
        avatar: DEFAULT_USER_AVATAR,
      });
      await this._authRepo.createAuthUserWithEmailAndPassword({ uid: newUser.id, email: body.email, password: body.password });
      await this._authRepo.setAuthUserClaims(newUser.id, new TokenClaims(UserRoles.USER));
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async adminRegister(body: AuthUserRegisterBody): Promise<void> {
    try {
      await this.usersService.checkUsernameExists(body.username);
      const newUser = await this.usersService.createUser({
        role: UserRoles.ADMIN,
        username: body.username,
        email: body.email,
        avatar: DEFAULT_USER_AVATAR,
      });
      await this._authRepo.createAuthUserWithEmailAndPassword({ uid: newUser.id, email: body.email, password: body.password });
      await this._authRepo.setAuthUserClaims(newUser.id, new TokenClaims(UserRoles.ADMIN));
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async updateAuthUser(userId: string, body: AuthUserUpdateBody): Promise<void> {
    try {
      if (body.email) {
        const userRecord = await this._authRepo.getAuthUserByEmail(body.email);
        if (userRecord) {
          throw new ApiError(ResponseCodes.BAD_REQUEST, ResponseMessages.EMAIL_TAKEN);
        }
        await this._authRepo.updateAuthUser(userId, { email: body.email });
        await this.usersService.updateUser(userId, { email: body.email });
      }
      if (body.password) {
        await this._authRepo.updateAuthUser(userId, { password: body.password });
      }
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteAuthUser(userId: string): Promise<void> {
    try {
      await this.usersService.deleteUser(userId);
      await this._authRepo.deleteAuthUser(userId);
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
