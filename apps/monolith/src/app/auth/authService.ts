import { Singleton } from 'typescript-ioc';
import { TokenClaims, AuthUserRegisterRequest, User, UserRoles } from '@rpg-together/models';
import { IAuthRepository, AuthRepositoryFirebase, IUsersRepository, UsersRepositoryFirestore } from '@rpg-together/repos';
import { apiErrorHandler, DEFAULT_USER_AVATAR } from '@rpg-together/utils';

@Singleton
export class AuthService {
  private _authRepo: IAuthRepository;
  private _usersRepo: IUsersRepository;

  constructor(authRepo: IAuthRepository, usersRepo: IUsersRepository) {
    this._authRepo = authRepo ?? new AuthRepositoryFirebase();
    this._usersRepo = usersRepo ?? new UsersRepositoryFirestore();
  }

  async userRegister(body: AuthUserRegisterRequest): Promise<void> {
    try {
      const authUser = await this._authRepo.createAuthUserWithEmailAndPassword(body);
      const newUser = new User(
        authUser.uid,
        UserRoles.USER,
        body.username,
        body.email,
        DEFAULT_USER_AVATAR,
        new Date(),
        new Date()
      );
      await Promise.all([
        this._authRepo.setUserClaims(authUser.uid, new TokenClaims(UserRoles.USER)),
        this._usersRepo.createUser(newUser),
      ]);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async adminRegister(body: AuthUserRegisterRequest): Promise<void> {
    try {
      const authUser = await this._authRepo.createAuthUserWithEmailAndPassword(body);
      const newUser = new User(
        authUser.uid,
        UserRoles.ADMIN,
        body.username,
        body.email,
        DEFAULT_USER_AVATAR,
        new Date(),
        new Date()
      );
      await Promise.all([
        this._authRepo.setUserClaims(authUser.uid, new TokenClaims(UserRoles.ADMIN)),
        this._usersRepo.createUser(newUser),
      ]);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async accountDelete(id: string): Promise<void> {
    try {
      await Promise.all([this._authRepo.deleteAuthUser(id), this._usersRepo.deleteUser(id)]);
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
