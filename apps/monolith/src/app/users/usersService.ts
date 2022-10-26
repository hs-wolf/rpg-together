import { Singleton } from 'typescript-ioc';
import { ApiError, ResponseCodes, User, UserCreationBody, UserUpdateBody } from '@rpg-together/models';
import { IUsersRepository, UsersRepositoryFirestore } from '@rpg-together/repos';
import { apiErrorHandler } from '@rpg-together/utils';

@Singleton
export class UsersService {
  private _usersRepo: IUsersRepository;

  constructor(usersRepo: IUsersRepository) {
    this._usersRepo = usersRepo ?? new UsersRepositoryFirestore();
  }

  async getUser(id: string): Promise<User> {
    try {
      const user = await this._usersRepo.getUser(id);
      if (!user) {
        throw new ApiError(ResponseCodes.NOT_FOUND, `User with id ${id} not found.`);
      }
      return user;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async createUser(id: string, body: UserCreationBody): Promise<User> {
    try {
      const newUser = User.fromMap({ id, ...body });
      await this._usersRepo.createUser(newUser);
      return newUser;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async updateUser(id: string, body: UserUpdateBody): Promise<User> {
    try {
      const user = await this.getUser(id);
      const updatedUser = User.fromMap({ ...user, ...body });
      await this._usersRepo.updateUser(updatedUser);
      return updatedUser;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteUser(id: string) {
    try {
      await this._usersRepo.deleteUser(id);
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
