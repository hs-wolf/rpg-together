import type { CreateRequest, UpdateRequest, UserRecord } from 'firebase-admin/auth'
import type { TokenClaims } from '@rpg-together/models'

export interface IAuthRepository {
  createAuthUserWithEmailAndPassword(
    request: CreateRequest
  ): Promise<UserRecord>

  getAuthUserByEmail(email: string): Promise<UserRecord | null>

  updateAuthUser(uid: string, request: UpdateRequest): Promise<UserRecord>

  deleteAuthUser(uid: string): Promise<void>

  setAuthUserClaims(uid: string, claims: TokenClaims): Promise<void>
}
