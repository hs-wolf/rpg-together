import { Singleton } from 'typescript-ioc'
import type {
  NotificationCreateBody,
  NotificationUpdateBody,
} from '@rpg-together/models'
import {
  ApiError,
  Notification,
  NotificationContent,
  NotificationType,
  ResponseCodes,
  ResponseMessages,
} from '@rpg-together/models'
import type { INotificationsRepository } from '@rpg-together/repositories'
import {
  NotificationsRepositoryMongoDB,
} from '@rpg-together/repositories'
import { apiErrorHandler } from '@rpg-together/utilities'
import { mongoDB } from '../../mongodb'

@Singleton
export class NotificationsService {
  private _notificationsRepo: INotificationsRepository

  constructor(notificationsRepo: INotificationsRepository) {
    this._notificationsRepo
      = notificationsRepo ?? new NotificationsRepositoryMongoDB(mongoDB)
  }

  async notifyNewApplication(userId: string, applicationId: string) {
    try {
      await this.createNotification({
        userId,
        type: NotificationType.APPLICATION,
        content: NotificationContent.APPLIED_TO_YOUR_TABLE,
        data: { id: applicationId },
      })
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async createNotification(
    body: NotificationCreateBody,
  ): Promise<Notification> {
    try {
      const newNotification = Notification.fromMap({ ...body })
      newNotification.read = false
      return await this._notificationsRepo.createNotification(newNotification)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getNotificationsFromUser(userId: string): Promise<Notification[]> {
    try {
      return await this._notificationsRepo.getNotificationsFromUser(userId)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getNotification(id: string): Promise<Notification> {
    try {
      const notification = await this._notificationsRepo.getNotification(id)
      if (!notification) {
        throw new ApiError(
          ResponseCodes.NOT_FOUND,
          ResponseMessages.NOTIFICATION_NOT_FOUND,
        )
      }
      return notification
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async readNotification(notificationId: string): Promise<void> {
    try {
      const notification = await this.getNotification(notificationId)
      await this.updateNotification(notification, { read: true })
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async updateNotification(
    notification: Notification | string,
    request: NotificationUpdateBody,
  ): Promise<Notification> {
    try {
      const oldNotification
        = typeof notification === 'string'
          ? await this.getNotification(notification)
          : notification
      const newNotification = Notification.fromMap({
        ...oldNotification,
        ...request,
      })
      await this._notificationsRepo.updateNotification(newNotification)
      return newNotification
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteNotificationsFromUser(userId: string) {
    try {
      const notificationsToDelete = await this.getNotificationsFromUser(userId)
      await Promise.all(
        notificationsToDelete.map(notification =>
          this.deleteNotification(notification),
        ),
      )
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteNotification(notificationId: Notification | string) {
    try {
      const notificationToDelete
        = typeof notificationId === 'string'
          ? await this.getNotification(notificationId)
          : notificationId
      await this._notificationsRepo.deleteNotification(notificationToDelete.id)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }
}
