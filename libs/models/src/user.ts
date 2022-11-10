export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class User {
  constructor(
    public id: string,
    public role: UserRoles = UserRoles.USER,
    public username: string,
    public email: string,
    public avatar: string,
    public creationDate: Date,
    public lastUpdateDate: Date
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromFirestore(snapshot: any) {
    if (!snapshot || !snapshot.exists) {
      return null;
    }
    return User.fromMap({ ...snapshot.data(), id: snapshot.id });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMap(map: any) {
    return new User(map.id, map.role, map.username, map.email, map.avatar, map.creationDate, map.lastUpdateDate);
  }

  toMap() {
    return {
      id: this.id,
      role: this.role,
      username: this.username,
      email: this.email,
      avatar: this.avatar,
      creationDate: this.creationDate,
      lastUpdateDate: this.lastUpdateDate,
    };
  }
}

export type UserUpdateRequest = Partial<Pick<User, 'username' | 'avatar'>>;
