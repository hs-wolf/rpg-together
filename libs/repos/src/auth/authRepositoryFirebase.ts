import { IAuthRepository } from './authRepositoryInterface';
import { CreateRequest, getAuth, UpdateRequest, UserRecord } from 'firebase-admin/auth';
import { TokenClaims } from '@rpg-together/models';

export class AuthRepositoryFirebase implements IAuthRepository {
  private auth = getAuth();

  async setUserClaims(uid: string, claims: TokenClaims): Promise<void> {
    return this.auth.setCustomUserClaims(uid, claims.toMap());
  }

  async createAuthUserWithEmailAndPassword(request: CreateRequest): Promise<UserRecord> {
    return this.auth.createUser(request);
  }

  async updateAuthUser(uid: string, request: UpdateRequest): Promise<UserRecord> {
    return this.auth.updateUser(uid, request);
  }

  async deleteAuthUser(uid: string): Promise<void> {
    return this.auth.deleteUser(uid);
  }
}
