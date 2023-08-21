import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';
import { Document } from 'mongodb';
import { TableHeader, UserHeader } from '.';

export class Application {
  constructor(
    public id: string,
    public status: ApplicationStatus,
    public table: TableHeader,
    public applicant: UserHeader,
    public message: string,
    public creationDate: Date,
    public lastUpdateDate: Date
  ) {}

  static fromFirestore(snapshot: DocumentSnapshot<DocumentData>) {
    return !snapshot || !snapshot.exists ? null : Application.fromMap({ ...snapshot.data(), id: snapshot.id });
  }

  static fromMongoDB(doc: Document | null): Application | null {
    if (!doc) {
      return null;
    }
    return Application.fromMap({ ...doc });
  }

  static fromMap(map: Record<string, unknown>) {
    return !map
      ? null
      : new Application(
          map['id'] as string,
          map['status'] as ApplicationStatus,
          map['table'] as TableHeader,
          map['applicant'] as UserHeader,
          map['message'] as string,
          map['creationDate'] as Date,
          map['lastUpdateDate'] as Date
        );
  }

  toMap(): Omit<Application, 'toMap'> {
    return {
      id: this.id,
      status: this.status,
      table: this.table,
      applicant: this.applicant,
      message: this.message,
      creationDate: this.creationDate,
      lastUpdateDate: this.lastUpdateDate,
    };
  }
}

export enum ApplicationStatus {
  WAITING = 'WAITING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export type ApplicationCreateBody = Partial<Pick<Application, 'applicant' | 'table' | 'message'>>;

export type ApplicationUpdateBody = Partial<Pick<Application, 'status' | 'lastUpdateDate'>>;
