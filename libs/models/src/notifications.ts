import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

export enum NotificationType {
  APPLICATION = 'application',
  REPORT = 'report',
  SYSTEM = 'system',
}

export class Notification {
  constructor(
    public id: string,
    public userId: string,
    public type: NotificationType,
    public read: boolean,
    public title: boolean,
    public message: boolean
  ) {}

  static fromFirestore(snapshot: DocumentSnapshot<DocumentData>) {
    return !snapshot || !snapshot.exists ? null : Notification.fromMap({ ...snapshot.data(), id: snapshot.id });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMap(map: any) {
    return !map ? null : new Notification(map.id, map.userId, map.type, map.read, map.title, map.message);
  }

  toMap() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      read: this.read,
      title: this.title,
      message: this.message,
    };
  }
}

export type NotificationCreateBody = Partial<Pick<Notification, 'userId' | 'type' | 'read' | 'title' | 'message'>>;

export type NotificationUpdateBody = Partial<Pick<Notification, 'read'>>;
