import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

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

export type NotificationData = {
  yourTableId: string;
  yourTableApplicantId: string;
  yourApplicationId: string;
};

export class Notification {
  constructor(
    public id: string,
    public userId: string,
    public type: NotificationType,
    public read: boolean,
    public content: NotificationContent,
    public data?: Partial<NotificationData>
  ) {}

  static fromFirestore(snapshot: DocumentSnapshot<DocumentData>) {
    return !snapshot || !snapshot.exists ? null : Notification.fromMap({ ...snapshot.data(), id: snapshot.id });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMap(map: any) {
    return !map ? null : new Notification(map.id, map.userId, map.type, map.read, map.content, map.data);
  }

  toMap() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      read: this.read,
      content: this.content,
      data: this.data,
    };
  }
}

export type NotificationCreateBody = Partial<Pick<Notification, 'userId' | 'type' | 'content' | 'data'>>;

export type NotificationUpdateBody = Partial<Pick<Notification, 'read'>>;
