import type { UserRoles } from '.'

export class TokenClaims {
  constructor(public role: UserRoles) {}

  static fromMap(map: Record<string, unknown>) {
    return !map ? null : new TokenClaims(map.role as UserRoles)
  }

  toMap(): Omit<TokenClaims, 'toMap'> {
    return {
      role: this.role,
    }
  }
}

export interface AuthUserRegisterBody {
  username: string
  email: string
  password: string
}

export type AuthUserUpdateBody = Partial<{ email: string; password: string }>
