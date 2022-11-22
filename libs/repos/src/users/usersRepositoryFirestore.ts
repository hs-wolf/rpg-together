import { getFirestore } from 'firebase-admin/firestore';
import { IUsersRepository } from './usersRepositoryInterface';
import { User } from '@rpg-together/models';
import { FIREBASE_COLLECTION_USERS } from '@rpg-together/utils';

export class UsersRepositoryFirestore implements IUsersRepository {
  private firestore = getFirestore();
  private collRef = this.firestore.collection(FIREBASE_COLLECTION_USERS);

  async getUserByUsername(username: string) {
    const query = this.collRef.where('username', '==', username);
    const querySnapshot = await query.get();
    if (querySnapshot.docs.length) {
      return User.fromFirestore(querySnapshot.docs[0]);
    }
    return null;
  }

  async getUser(id: string) {
    const snapshot = await this.collRef.doc(id).get();
    return User.fromFirestore(snapshot);
  }

  async createUser(user: User) {
    if (user.id) {
      await this.collRef.doc(user.id).set(user.toMap());
      return user;
    }
    const newUser = await (await this.collRef.add(user.toMap())).get();
    return User.fromFirestore(newUser);
  }

  async updateUser(user: User) {
    await this.collRef.doc(user.id).update(user.toMap());
  }

  async deleteUser(id: string) {
    await this.collRef.doc(id).delete();
  }
}
