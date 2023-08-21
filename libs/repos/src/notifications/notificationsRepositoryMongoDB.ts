import { Db, ObjectId } from 'mongodb';
import { Notification } from '@rpg-together/models';
import { MONGODB_COLLECTION_NOTIFICATIONS, mongodbPipelineGetNotification } from '@rpg-together/utils';
import { INotificationsRepository } from './notificationsRepositoryInterface';

export class NotificationsRepositoryMongoDB implements INotificationsRepository {
  constructor(private mongoDB: Db) {}

  private _collection = this.mongoDB.collection(MONGODB_COLLECTION_NOTIFICATIONS);

  async createNotification(notification: Notification) {
    const newNotification = notification;
    const _id = new ObjectId();
    newNotification.id = _id.toString();
    await this._collection.insertOne({ _id, ...newNotification.toMap() });
    return newNotification;
  }

  async getNotificationsFromUser(userId: string) {
    const docs = await this._collection.aggregate([{ $match: { userId } }, ...mongodbPipelineGetNotification()]).toArray();
    return docs.map((doc) => Notification.fromMongoDB(doc)).filter((notification) => notification) as Notification[];
  }

  async getNotification(notificationId: string) {
    const docs = await this._collection
      .aggregate([{ $match: { id: notificationId } }, ...mongodbPipelineGetNotification()])
      .toArray();
    return Notification.fromMongoDB(docs[0]);
  }

  async updateNotification(notification: Notification) {
    await this._collection.updateOne({ id: notification.id }, { $set: notification.toMap() });
  }

  async deleteNotification(notificationId: string) {
    await this._collection.deleteOne({ id: notificationId });
  }
}
