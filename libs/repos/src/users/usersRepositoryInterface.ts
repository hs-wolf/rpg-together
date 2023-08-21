import { User } from '@rpg-together/models';

export interface IUsersRepository {
  createUser(user: User): Promise<User | null>;

  getUserByUsername(username: string): Promise<User | null>;

  getUser(userId: string): Promise<User | null>;

  updateUser(user: User): Promise<void>;

  deleteUser(userId: string): Promise<void>;
}
