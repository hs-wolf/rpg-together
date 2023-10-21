import { Controller, Get, Path, Put as Post, Route, Tags } from 'tsoa'
import type { Notification } from '@rpg-together/models'
import { NotificationsService } from './notificationsService'

@Tags('Notifications Service')
@Route('/notifications')
export class NotificationsController extends Controller {
  @Get('/from-user/{userId}')
  public async getNotificationsFromUser(
    @Path() userId: string,
  ): Promise<Notification[]> {
    return new NotificationsService().getNotificationsFromUser(userId)
  }

  @Get('/{notificationId}')
  public async getNotification(
    @Path() notificationId: string,
  ): Promise<Notification> {
    return new NotificationsService().getNotification(notificationId)
  }

  @Post('/{notificationId}/read')
  public async readNotification(@Path() notificationId: string): Promise<void> {
    return new NotificationsService().readNotification(notificationId)
  }
}
