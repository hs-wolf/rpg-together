import { IAuthRepository } from './authRepositoryInterface';
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { TokenClaims, UserRegisterBody } from '@rpg-together/models';

export class AuthRepositoryFirebaseAuth implements IAuthRepository {
  private auth = getAuth();

  async setUserClaims(uid: string, claims: TokenClaims): Promise<void> {
    return this.auth.setCustomUserClaims(uid, claims.toMap());
  }

  async createAuthUserWithEmailAndPassword(body: UserRegisterBody): Promise<UserRecord> {
    return this.auth.createUser({
      email: body.email,
      password: body.password,
    });
  }

  async deleteAuthUser(uid: string): Promise<void> {
    return this.auth.deleteUser(uid);
  }
}
