import { Document } from 'mongodb';
import { ApplicationHeader } from '.';

export class Notification {
  constructor(
    public id: string,
    public userId: string,
    public type: NotificationType,
    public content: NotificationContent,
    public read: boolean,
    public creationDate: Date,
    public lastUpdateDate: Date,
    public data?: NotificationData
  ) {}

  static fromMongoDB(doc: Document | null): Notification | null {
    if (!doc) {
      return null;
    }
    return Notification.fromMap({ ...doc });
  }

  static fromMap(map: Record<string, unknown>) {
    return !map
      ? null
      : new Notification(
          map['id'] as string,
          map['userId'] as string,
          map['type'] as NotificationType,
          map['content'] as NotificationContent,
          map['read'] as boolean,
          map['creationDate'] as Date,
          map['lastUpdateDate'] as Date,
          map['data'] as NotificationData
        );
  }

  toMap(): Omit<Notification, 'toMap'> {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      content: this.content,
      read: this.read,
      creationDate: this.creationDate,
      lastUpdateDate: this.lastUpdateDate,
      data: this.data,
    };
  }
}

export enum NotificationType {
  APPLICATION = 'application',
  REPORT = 'report',
  SYSTEM = 'system',
}

export enum NotificationContent {
  APPLIED_TO_YOUR_TABLE = 'applied-to-your-table',
  APPLICATION_ACCEPTED = 'application-accepted',
  APPLICATION_DECLINED = 'application-declined',
}

export type NotificationData = ApplicationHeader;

export type NotificationCreateBody = Partial<Pick<Notification, 'userId' | 'type' | 'content' | 'data'>>;

export type NotificationUpdateBody = Partial<Pick<Notification, 'read' | 'lastUpdateDate'>>;
