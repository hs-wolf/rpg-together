import { Controller, Get, Path, Put as Post, Route, Tags } from 'tsoa'
import { Inject } from 'typescript-ioc'
import type { Notification } from '@rpg-together/models'
import type { NotificationsService } from './notificationsService'

@Tags('Notifications Service')
@Route('/notifications')
export class NotificationsController extends Controller {
  @Inject
  private _notificationsService: NotificationsService

  @Get('/from-user/{userId}')
  public async getNotificationsFromUser(
    @Path() userId: string,
  ): Promise<Notification[]> {
    return this._notificationsService.getNotificationsFromUser(userId)
  }

  @Get('/{notificationId}')
  public async getNotification(
    @Path() notificationId: string,
  ): Promise<Notification> {
    return this._notificationsService.getNotification(notificationId)
  }

  @Post('/{notificationId}/read')
  public async readNotification(@Path() notificationId: string): Promise<void> {
    return this._notificationsService.readNotification(notificationId)
  }
}
