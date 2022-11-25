import { UserRoles } from './user';

export class TokenClaims {
  constructor(public role: UserRoles) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMap(map: any) {
    return !map ? null : new TokenClaims(map.role);
  }

  toMap() {
    return {
      role: this.role,
    };
  }
}

export type AuthUserRegisterBody = { username: string; email: string; password: string };

export type AuthUserUpdateBody = Partial<{ email: string; password: string }>;
