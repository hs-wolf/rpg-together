import type { Document } from 'mongodb'
import type { TableHeader, UserHeader } from '.'

export class Application {
  constructor(
    public id: string,
    public status: ApplicationStatus,
    public applicant: UserHeader,
    public table: TableHeader,
    public message: string,
    public creationDate: Date,
    public lastUpdateDate: Date,
  ) {}

  static fromMongoDB(doc: Document | null): Application | null {
    if (!doc)
      return null

    return Application.fromMap({ ...doc })
  }

  static fromMap(map: Record<string, unknown>) {
    return !map
      ? null
      : new Application(
        map.id as string,
        map.status as ApplicationStatus,
        map.applicant as UserHeader,
        map.table as TableHeader,
        map.message as string,
        map.creationDate as Date,
        map.lastUpdateDate as Date,
      )
  }

  toMap(): Omit<Application, 'toMap'> {
    return {
      id: this.id,
      status: this.status,
      applicant: this.applicant,
      table: this.table,
      message: this.message,
      creationDate: this.creationDate,
      lastUpdateDate: this.lastUpdateDate,
    }
  }
}

export enum ApplicationStatus {
  WAITING = 'WAITING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export type ApplicationHeader = Partial<
  Pick<Application, 'id' | 'applicant' | 'table'>
>

export type ApplicationCreateBody = Partial<
  Pick<Application, 'status' | 'applicant' | 'table' | 'message'>
>

export type ApplicationCreateBodyRequest = Pick<
  ApplicationCreateBody,
  'applicant' | 'table' | 'message'
>

export type ApplicationUpdateBody = Partial<
  Pick<Application, 'status' | 'lastUpdateDate'>
>
