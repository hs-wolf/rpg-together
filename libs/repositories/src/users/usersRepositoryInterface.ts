import type { User } from '@rpg-together/models'

export interface IUsersRepository {
  getUserByUsername(username: string): Promise<User | null>

  getUserByEmail(email: string): Promise<User | null>

  getUser(userId: string): Promise<User | null>

  updateUser(user: User): Promise<void>

  deleteUser(userId: string): Promise<void>
}
