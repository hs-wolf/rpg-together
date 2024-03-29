import type { Document } from 'mongodb'

export class User {
  constructor(
    public id: string,
    public role: UserRoles,
    public username: string,
    public email: string,
    public avatar: string,
    public creationDate: Date,
    public lastUpdateDate: Date,
  ) {}

  static fromMongoDB(doc: Document | null): User | null {
    if (!doc)
      return null

    return User.fromMap({ ...doc })
  }

  static fromMap(map: User | Record<string, unknown>) {
    return !map
      ? null
      : new User(
        map.id as string,
        map.role as UserRoles,
        map.username as string,
        map.email as string,
        map.avatar as string,
        new Date(map.creationDate as Date),
        new Date(map.lastUpdateDate as Date),
      )
  }

  toMap(): Omit<User, 'toMap'> {
    return {
      id: this.id,
      role: this.role,
      username: this.username,
      email: this.email,
      avatar: this.avatar,
      creationDate: this.creationDate,
      lastUpdateDate: this.lastUpdateDate,
    }
  }
}

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type UserHeader = Partial<Pick<User, 'id' | 'username' | 'avatar'>>

export type UserCreateBody = Partial<
  Pick<User, 'role' | 'username' | 'email' | 'avatar'>
>

export type UserUpdateBody = Partial<
  Pick<User, 'username' | 'email' | 'avatar' | 'lastUpdateDate'>
>

export type UserUpdateBodyRequest = Partial<Pick<UserUpdateBody, 'username' | 'avatar'>>
