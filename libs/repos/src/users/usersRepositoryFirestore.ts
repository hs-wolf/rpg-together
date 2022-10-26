import * as admin from 'firebase-admin';
import { IUsersRepository } from './usersRepositoryInterface';
import { User } from '@rpg-together/models';
import { FIREBASE_COLLECTION_USERS } from '@rpg-together/utils';

export class UsersRepositoryFirestore implements IUsersRepository {
  private firestore = admin.firestore();
  private collRef = this.firestore.collection(FIREBASE_COLLECTION_USERS);

  async getUser(id: string) {
    const snapshot = await this.collRef.doc(id).get();
    return User.fromFirestore(snapshot);
  }

  async createUser(user: User) {
    await this.collRef.doc(user.id).set(user.toMap());
  }

  async updateUser(user: User) {
    await this.collRef.doc(user.id).update(user.toMap());
  }

  async deleteUser(id: string) {
    await this.collRef.doc(id).delete();
  }
}
