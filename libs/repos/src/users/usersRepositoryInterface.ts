import { User } from '@rpg-together/models';

export interface IUsersRepository {
  getUser(id: string): Promise<User | null>;

  createUser(user: User): Promise<void>;

  updateUser(user: User): Promise<void>;

  deleteUser(id: string): Promise<void>;
}
