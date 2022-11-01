import { Inject, Singleton } from 'typescript-ioc';
import { UsersService } from '../users/usersService';
import { TokenClaims, UserRegisterBody, UserRoles } from '@rpg-together/models';
import { IAuthRepository, AuthRepositoryFirebaseAuth } from '@rpg-together/repos';
import { apiErrorHandler, DEFAULT_USER_AVATAR } from '@rpg-together/utils';

@Singleton
export class AuthService {
  @Inject
  private _usersService: UsersService;

  private _authRepo: IAuthRepository;

  constructor(authRepo: IAuthRepository) {
    this._authRepo = authRepo ?? new AuthRepositoryFirebaseAuth();
  }

  async userRegister(body: UserRegisterBody): Promise<void> {
    try {
      const authUser = await this._authRepo.createAuthUserWithEmailAndPassword(body);
      await this._authRepo.setUserClaims(authUser.uid, new TokenClaims(UserRoles.USER));
      await this._usersService.createUser(authUser.uid, {
        role: UserRoles.USER,
        username: body.username,
        email: body.email,
        avatar: DEFAULT_USER_AVATAR,
      });
    } catch (error) {
      console.log(error);
      apiErrorHandler(error);
    }
  }

  async adminRegister(body: UserRegisterBody): Promise<void> {
    try {
      const authUser = await this._authRepo.createAuthUserWithEmailAndPassword(body);
      await this._authRepo.setUserClaims(authUser.uid, new TokenClaims(UserRoles.ADMIN));
      await this._usersService.createUser(authUser.uid, {
        role: UserRoles.ADMIN,
        username: body.username,
        email: body.email,
        avatar: DEFAULT_USER_AVATAR,
      });
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
