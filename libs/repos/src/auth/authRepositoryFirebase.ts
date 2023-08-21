import { CreateRequest, getAuth, UpdateRequest, UserRecord } from 'firebase-admin/auth';
import { TokenClaims } from '@rpg-together/models';
import { IAuthRepository } from './authRepositoryInterface';

export class AuthRepositoryFirebase implements IAuthRepository {
  private auth = getAuth();

  async createAuthUserWithEmailAndPassword(request: CreateRequest): Promise<UserRecord> {
    return this.auth.createUser(request);
  }

  async getAuthUserByEmail(email: string): Promise<UserRecord | null> {
    return this.auth
      .getUserByEmail(email)
      .then((userRecord) => userRecord)
      .catch(() => null);
  }

  async updateAuthUser(uid: string, request: UpdateRequest): Promise<UserRecord> {
    return this.auth.updateUser(uid, request);
  }

  async deleteAuthUser(uid: string): Promise<void> {
    return this.auth.deleteUser(uid);
  }

  async setAuthUserClaims(uid: string, claims: TokenClaims): Promise<void> {
    return this.auth.setCustomUserClaims(uid, claims.toMap());
  }
}
