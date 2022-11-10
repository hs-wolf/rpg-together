import { CreateRequest, UpdateRequest, UserRecord } from 'firebase-admin/auth';
import { TokenClaims } from '@rpg-together/models';

export interface IAuthRepository {
  setUserClaims(uid: string, claims: TokenClaims): Promise<void>;

  createAuthUserWithEmailAndPassword(request: CreateRequest): Promise<UserRecord>;

  updateAuthUser(uid: string, request: UpdateRequest): Promise<UserRecord>;

  deleteAuthUser(uid: string): Promise<void>;
}
