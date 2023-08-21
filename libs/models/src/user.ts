import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';
import { Document } from 'mongodb';

export class User {
  constructor(
    public id: string,
    public role: UserRoles,
    public username: string,
    public email: string,
    public avatar: string,
    public creationDate: Date,
    public lastUpdateDate: Date
  ) {}

  static fromFirestore(snapshot: DocumentSnapshot<DocumentData>) {
    return !snapshot || !snapshot.exists ? null : User.fromMap({ ...snapshot.data(), id: snapshot.id });
  }

  static fromMongoDB(doc: Document | null): User | null {
    if (!doc) {
      return null;
    }
    return User.fromMap({ ...doc });
  }

  static fromMap(map: Record<string, unknown>) {
    return !map
      ? null
      : new User(
          map['id'] as string,
          map['role'] as UserRoles,
          map['username'] as string,
          map['email'] as string,
          map['avatar'] as string,
          map['creationDate'] as Date,
          map['lastUpdateDate'] as Date
        );
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
    };
  }
}

export enum UserRoles {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export type UserHeader = Partial<Pick<User, 'id' | 'username' | 'avatar'>>;

export type UserCreateBody = Partial<Pick<User, 'id' | 'role' | 'username' | 'email' | 'avatar'>>;

export type UserUpdateBody = Partial<Pick<User, 'username' | 'email' | 'avatar'>>;
