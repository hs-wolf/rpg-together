import { DocumentSnapshot, DocumentData } from 'firebase-admin/firestore';

export class Application {
  constructor(
    public id: string,
    public applicantId: string,
    public applicantHeader: {
      username: string;
      avatar: string;
    },
    public tableId: string,
    public tableHeader: {
      title: string;
      banner: string;
    },
    public message: string,
    public status: ApplicationStatus,
    public creationDate: Date,
    public lastUpdateDate: Date
  ) {}

  static fromFirestore(snapshot: DocumentSnapshot<DocumentData>) {
    return !snapshot || !snapshot.exists ? null : Application.fromMap({ ...snapshot.data(), id: snapshot.id });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromMap(map: any) {
    return new Application(
      map.id,
      map.applicantId,
      map.applicantHeader,
      map.tableId,
      map.tableHeader,
      map.message,
      map.status,
      map.creationDate,
      map.lastUpdateDate
    );
  }

  toMap() {
    return {
      id: this.id,
      applicantId: this.applicantId,
      applicantHeader: this.applicantHeader,
      tableId: this.tableId,
      tableHeader: this.tableHeader,
      message: this.message,
      status: this.status,
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

export type ApplicationCreateBody = Partial<Pick<Application, 'message'>>;

export type ApplicationUpdateBody = Partial<Pick<Application, 'applicantHeader' | 'tableHeader' | 'status'>>;
