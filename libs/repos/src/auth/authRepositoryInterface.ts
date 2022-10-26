import { UserRecord } from 'firebase-admin/auth';
import { TokenClaims, UserRegisterBody } from '@rpg-together/models';

export interface IAuthRepository {
  setUserClaims(uid: string, claims: TokenClaims): Promise<void>;

  createAuthUserWithEmailAndPassword(body: UserRegisterBody): Promise<UserRecord>;

  deleteAuthUser(uid: string): Promise<void>;
}
