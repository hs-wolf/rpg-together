import { UserRoles } from './user';

export class TokenClaims {
  constructor(public role: UserRoles) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMap(map: any) {
    if (!map) {
      return null;
    }
    return new TokenClaims(map['role'] ?? null);
  }

  toMap() {
    return {
      role: this.role,
    };
  }
}

export type AuthUserRegisterRequest = { username: string; email: string; password: string };
