import { getFirestore } from 'firebase-admin/firestore';
import { IFlairsRepository } from './flairsRepositoryInterface';
import { Flair } from '@rpg-together/models';
import { FIREBASE_COLLECTION_FLAIRS } from '@rpg-together/utils';

export class FlairsRepositoryFirestore implements IFlairsRepository {
  private firestore = getFirestore();
  private collRef = this.firestore.collection(FIREBASE_COLLECTION_FLAIRS);

  async getAllFlairs() {
    const querySnapshot = await this.collRef.get();
    if (querySnapshot.docs.length) {
      return querySnapshot.docs.map((doc) => Flair.fromFirestore(doc)).filter((flair) => flair) as Flair[];
    }
    return [];
  }

  async getFlair(id: string) {
    const snapshot = await this.collRef.doc(id).get();
    return Flair.fromFirestore(snapshot);
  }

  async createFlair(flair: Flair) {
    const newFlair = await (await this.collRef.add(flair.toMap())).get();
    return Flair.fromFirestore(newFlair);
  }

  async updateFlair(flair: Flair) {
    await this.collRef.doc(flair.id).update(flair.toMap());
  }

  async deleteFlair(id: string) {
    await this.collRef.doc(id).delete();
  }
}
