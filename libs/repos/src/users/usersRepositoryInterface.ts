import { User } from '@rpg-together/models';

export interface IUsersRepository {
  getUserByUsername(username: string): Promise<User | null>;

  getUser(id: string): Promise<User | null>;

  createUser(user: User): Promise<User | null>;

  updateUser(user: User): Promise<void>;

  deleteUser(id: string): Promise<void>;
}
