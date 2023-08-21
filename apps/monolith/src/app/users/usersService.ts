import { Inject, Singleton } from 'typescript-ioc';
import { ApiError, ResponseCodes, ResponseMessages, User, UserCreateBody, UserUpdateBody } from '@rpg-together/models';
import { IUsersRepository, UsersRepositoryMongoDB } from '@rpg-together/repos';
import { apiErrorHandler } from '@rpg-together/utils';
import { mongoDB } from '../../mongodb';
import { TablesService } from '../tables/tablesService';
import { UploadService } from '../upload/uploadService';

@Singleton
export class UsersService {
  constructor(usersRepo: IUsersRepository) {
    this._usersRepo = usersRepo ?? new UsersRepositoryMongoDB(mongoDB);
  }

  private _usersRepo: IUsersRepository;

  @Inject
  private tablesService: TablesService;

  @Inject
  private uploadService: UploadService;

  async createUser(body: UserCreateBody): Promise<User> {
    try {
      const currentDate = new Date();
      let newUser = User.fromMap({ ...body });
      newUser.creationDate = currentDate;
      newUser.lastUpdateDate = currentDate;
      newUser = await this._usersRepo.createUser(newUser);
      return newUser;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const user = await this._usersRepo.getUser(id);
      if (!user) {
        throw new ApiError(ResponseCodes.NOT_FOUND, ResponseMessages.USER_NOT_FOUND);
      }
      return user;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async updateUser(userId: string, body: UserUpdateBody): Promise<User> {
    try {
      if (body.username) {
        await this.checkUsernameExists(body.username);
      }
      const oldUser = await this.getUser(userId);
      const newUser = User.fromMap({ ...oldUser, ...body });
      newUser.lastUpdateDate = new Date();
      await this._usersRepo.updateUser(newUser);
      return newUser;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteUser(userId: string) {
    try {
      await this.tablesService.deleteTablesFromUser(userId);
      await this.uploadService.deleteAllUserFiles(userId);
      await this._usersRepo.deleteUser(userId);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async checkUsernameExists(username: string) {
    try {
      const user = await this._usersRepo.getUserByUsername(username);
      if (user) {
        throw new ApiError(ResponseCodes.BAD_REQUEST, ResponseMessages.USERNAME_TAKEN);
      }
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
