import { Inject, Singleton } from 'typescript-ioc';
import { UsersService } from '../users/usersService';
import { TablesService } from '../tables/tablesService';
import { TokenClaims, AuthUserRegisterBody, UserRoles } from '@rpg-together/models';
import { IAuthRepository, AuthRepositoryFirebase } from '@rpg-together/repos';
import { apiErrorHandler, DEFAULT_USER_AVATAR } from '@rpg-together/utils';

@Singleton
export class AuthService {
  @Inject
  private usersService: UsersService;
  @Inject
  private tablesService: TablesService;

  private _authRepo: IAuthRepository;

  constructor(authRepo: IAuthRepository) {
    this._authRepo = authRepo ?? new AuthRepositoryFirebase();
  }

  async userRegister(body: AuthUserRegisterBody): Promise<void> {
    try {
      const authUser = await this._authRepo.createAuthUserWithEmailAndPassword({ email: body.email, password: body.password });
      await Promise.all([
        this._authRepo.setUserClaims(authUser.uid, new TokenClaims(UserRoles.USER)),
        this.usersService.createUser({
          id: authUser.uid,
          role: UserRoles.USER,
          username: body.username,
          email: body.email,
          avatar: DEFAULT_USER_AVATAR,
        }),
      ]);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async adminRegister(body: AuthUserRegisterBody): Promise<void> {
    try {
      const authUser = await this._authRepo.createAuthUserWithEmailAndPassword({ email: body.email, password: body.password });
      await Promise.all([
        this._authRepo.setUserClaims(authUser.uid, new TokenClaims(UserRoles.ADMIN)),
        this.usersService.createUser({
          id: authUser.uid,
          role: UserRoles.ADMIN,
          username: body.username,
          email: body.email,
          avatar: DEFAULT_USER_AVATAR,
        }),
      ]);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async accountDelete(userId: string): Promise<void> {
    try {
      await Promise.all([
        this._authRepo.deleteAuthUser(userId),
        this.usersService.deleteUser(userId),
        this.tablesService.deleteTablesFromUser(userId),
      ]);
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
