import { Singleton } from 'typescript-ioc';
import {
  ApiError,
  ResponseCodes,
  ResponseMessages,
  Notification,
  NotificationCreateBody,
  NotificationUpdateBody,
  NotificationData,
  NotificationType,
  NotificationContent,
} from '@rpg-together/models';
import { INotificationsRepository, NotificationsRepositoryFirestore } from '@rpg-together/repos';
import { apiErrorHandler } from '@rpg-together/utils';

@Singleton
export class NotificationsService {
  private _notificationsRepo: INotificationsRepository;

  constructor(notificationsRepo: INotificationsRepository) {
    this._notificationsRepo = notificationsRepo ?? new NotificationsRepositoryFirestore();
  }

  async createNotification(body: NotificationCreateBody): Promise<Notification> {
    try {
      const newNotification = Notification.fromMap({ ...body });
      newNotification.read = false;
      return await this._notificationsRepo.createNotification(newNotification);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async notifyNewApplication(userId: string, data: Pick<NotificationData, 'yourTableId' | 'yourTableApplicantId'>) {
    try {
      await this.createNotification({
        userId,
        type: NotificationType.APPLICATION,
        content: NotificationContent.APPLIED_TO_YOUR_TABLE,
        data,
      });
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async getNotificationsFromUser(userId: string): Promise<Notification[]> {
    try {
      return await this._notificationsRepo.getNotificationsFromUser(userId);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async getNotification(id: string): Promise<Notification> {
    try {
      const notification = await this._notificationsRepo.getNotification(id);
      if (!notification) {
        throw new ApiError(ResponseCodes.NOT_FOUND, ResponseMessages.NOTIFICATION_NOT_FOUND);
      }
      return notification;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async readNotification(notificationId: string): Promise<void> {
    try {
      const notification = await this.getNotification(notificationId);
      await this.updateNotification(notification, { read: true });
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async updateNotification(notification: Notification | string, request: NotificationUpdateBody): Promise<Notification> {
    try {
      const oldNotification = typeof notification === 'string' ? await this.getNotification(notification) : notification;
      const newNotification = Notification.fromMap({
        ...oldNotification,
        ...request,
      });
      await this._notificationsRepo.updateNotification(newNotification);
      return newNotification;
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteNotificationsFromUser(userId: string) {
    try {
      const notificationsToDelete = await this.getNotificationsFromUser(userId);
      await Promise.all(notificationsToDelete.map((notification) => this.deleteNotification(notification)));
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async deleteNotification(notification: Notification | string) {
    try {
      const notificationToDelete = typeof notification === 'string' ? await this.getNotification(notification) : notification;
      await this._notificationsRepo.deleteNotification(notificationToDelete.id);
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
