import { Singleton } from 'typescript-ioc';
import { User, UserUpdateRequest } from '@rpg-together/models';
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
      return user;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async updateUser(id: string, body: UserUpdateRequest): Promise<User> {
    try {
      const oldUser = await this.getUser(id);
      const updatedUser = User.fromMap({ ...oldUser, ...body });
      updatedUser.lastUpdateDate = new Date();
      await this._usersRepo.updateUser(updatedUser);
      return updatedUser;
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
