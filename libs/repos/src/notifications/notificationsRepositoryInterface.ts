import { Notification } from '@rpg-together/models';

export interface INotificationsRepository {
  createNotification(notification: Notification): Promise<Notification | null>;

  getNotification(notificationId: string): Promise<Notification | null>;

  getNotificationsFromUser(userId: string): Promise<Notification[]>;

  updateNotification(notification: Notification): Promise<void>;

  deleteNotification(notificationId: string): Promise<void>;
}
