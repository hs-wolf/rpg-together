import type { UserRoles } from '.'

export class TokenClaims {
  constructor(public role: UserRoles) {}

  static fromMap(map: TokenClaims | Record<string, unknown>) {
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
  recaptcha_token?: string
}

export type AuthUserUpdateBody = Partial<{ email: string; password: string }>

export interface RecaptchaVerificationResponse {
  success: boolean
  challenge_ts: string
  hostname: string
  score: number
  action: string
  'error-codes'?: string[]
}
