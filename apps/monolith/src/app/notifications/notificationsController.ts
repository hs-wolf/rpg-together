import { Controller, Get, Path, Put, Route, Tags } from 'tsoa';
import { Inject } from 'typescript-ioc';
import { NotificationsService } from './notificationsService';
import { Notification } from '@rpg-together/models';

@Tags('Notifications Service')
@Route('/notifications')
export class NotificationsController extends Controller {
  @Inject
  private _notificationsService: NotificationsService;

  @Get('/from-user/{userId}')
  public async getNotificationsFromUser(@Path() userId: string): Promise<Notification[]> {
    return this._notificationsService.getNotificationsFromUser(userId);
  }

  @Get('/{notificationId}')
  public async getNotification(@Path() notificationId: string): Promise<Notification> {
    return this._notificationsService.getNotification(notificationId);
  }

  @Put('/{notificationId}/read')
  public async readNotification(@Path() notificationId: string): Promise<void> {
    return this._notificationsService.readNotification(notificationId);
  }
}
