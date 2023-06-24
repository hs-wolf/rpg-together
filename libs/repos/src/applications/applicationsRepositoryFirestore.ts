import { getFirestore } from 'firebase-admin/firestore';
import { IApplicationsRepository } from './applicationsRepositoryInterface';
import { Application } from '@rpg-together/models';
import { FIREBASE_COLLECTION_APPLICATIONS } from '@rpg-together/utils';

export class ApplicationsRepositoryFirestore implements IApplicationsRepository {
  private firestore = getFirestore();
  private collRef = this.firestore.collection(FIREBASE_COLLECTION_APPLICATIONS);

  async createApplication(application: Application) {
    if (application.id) {
      await this.collRef.doc(application.id).set(application.toMap());
      return application;
    }
    const newApplication = await (await this.collRef.add(application.toMap())).get();
    return Application.fromFirestore(newApplication);
  }

  async getApplication(applicationId: string) {
    const snapshot = await this.collRef.doc(applicationId).get();
    return Application.fromFirestore(snapshot);
  }

  async getApplicationsFromUser(userId: string) {
    const query = this.collRef.where('applicantId', '==', userId);
    const querySnapshot = await query.get();
    if (querySnapshot.docs.length) {
      return querySnapshot.docs
        .map((snapshot) => Application.fromFirestore(snapshot))
        .filter((table) => table) as Application[];
    }
    return [];
  }

  async getApplicationsFromTable(tableId: string) {
    const query = this.collRef.where('tableId', '==', tableId);
    const querySnapshot = await query.get();
    if (querySnapshot.docs.length) {
      return querySnapshot.docs
        .map((snapshot) => Application.fromFirestore(snapshot))
        .filter((table) => table) as Application[];
    }
    return [];
  }

  async getApplicationFromTableAndUser(tableId: string, userId: string) {
    const query = this.collRef.where('tableId', '==', tableId).where('applicantId', '==', userId);
    const querySnapshot = await query.get();
    if (querySnapshot.docs.length) {
      return querySnapshot.docs.map((snapshot) => Application.fromFirestore(snapshot)).filter((table) => table)[0];
    }
    return null;
  }

  async updateApplication(application: Application) {
    await this.collRef.doc(application.id).update(application.toMap());
  }

  async deleteApplication(applicationId: string) {
    await this.collRef.doc(applicationId).delete();
  }
}
