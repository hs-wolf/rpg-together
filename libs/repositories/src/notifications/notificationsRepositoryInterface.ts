import type { Notification } from '@rpg-together/models'

export interface INotificationsRepository {
  createNotification(notification: Notification): Promise<Notification | null>

  getNotificationsFromUser(userId: string): Promise<Notification[]>

  getNotification(notificationId: string): Promise<Notification | null>

  updateNotification(notification: Notification): Promise<void>

  deleteNotification(notificationId: string): Promise<void>
}
