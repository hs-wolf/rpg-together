import { getFirestore } from 'firebase-admin/firestore';
import { INotificationsRepository } from './notificationsRepositoryInterface';
import { Notification } from '@rpg-together/models';
import { FIREBASE_COLLECTION_NOTIFICATIONS } from '@rpg-together/utils';

export class NotificationsRepositoryFirestore implements INotificationsRepository {
  private firestore = getFirestore();
  private collRef = this.firestore.collection(FIREBASE_COLLECTION_NOTIFICATIONS);

  async createNotification(notification: Notification) {
    if (notification.id) {
      await this.collRef.doc(notification.id).set(notification.toMap());
      return notification;
    }
    const newNotification = await (await this.collRef.add(notification.toMap())).get();
    return Notification.fromFirestore(newNotification);
  }

  async getNotification(notificationId: string) {
    const snapshot = await this.collRef.doc(notificationId).get();
    return Notification.fromFirestore(snapshot);
  }

  async getNotificationsFromUser(userId: string) {
    const query = this.collRef.where('userId', '==', userId);
    const querySnapshot = await query.get();
    if (querySnapshot.docs.length) {
      return querySnapshot.docs
        .map((snapshot) => Notification.fromFirestore(snapshot))
        .filter((table) => table) as Notification[];
    }
    return [];
  }

  async updateNotification(notification: Notification) {
    await this.collRef.doc(notification.id).update(notification.toMap());
  }

  async deleteNotification(notificationId: string) {
    await this.collRef.doc(notificationId).delete();
  }
}
