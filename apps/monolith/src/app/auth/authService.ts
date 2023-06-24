import { Inject, Singleton } from 'typescript-ioc';
import { UsersService } from '../users/usersService';
import { TablesService } from '../tables/tablesService';
import { UploadService } from '../upload/uploadService';
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

@Singleton
export class AuthService {
  @Inject
  private usersService: UsersService;
  @Inject
  private tablesService: TablesService;
  @Inject
  private uploadService: UploadService;

  private _authRepo: IAuthRepository;

  constructor(authRepo: IAuthRepository) {
    this._authRepo = authRepo ?? new AuthRepositoryFirebase();
  }

  async userRegister(body: AuthUserRegisterBody): Promise<void> {
    try {
      await this.usersService.checkUsernameExists(body.username);
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
      await this.usersService.checkUsernameExists(body.username);
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

  async updateAuthUser(userId: string, body: AuthUserUpdateBody): Promise<void> {
    try {
      if (body.email) {
        console.log('A');
        const userRecord = await this._authRepo.getAuthUserByEmail(body.email);
        console.log(userRecord);
        if (userRecord) {
          console.log('B');
          throw new ApiError(ResponseCodes.BAD_REQUEST, ResponseMessages.EMAIL_TAKEN);
        }
      }
      console.log('C');
      await this._authRepo.updateAuthUser(userId, { email: body.email, password: body.password });
      if (body.email) {
        await this.usersService.updateUser(userId, { email: body.email });
      }
      console.log('D');
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteAuth(userId: string): Promise<void> {
    try {
      await Promise.all([
        this._authRepo.deleteAuthUser(userId),
        this.usersService.deleteUser(userId),
        this.tablesService.deleteTablesFromUser(userId),
        this.uploadService.deleteAllUserFiles(userId),
      ]);
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
