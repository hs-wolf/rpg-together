import type { Document } from 'mongodb'

export class AcceptMessage {
  constructor(
    public id: string,
    public message: string,
    public creationDate: Date,
    public lastUpdateDate: Date,
  ) {}

  static fromMongoDB(doc: Document | null): AcceptMessage | null {
    if (!doc)
      return null

    return AcceptMessage.fromMap({ ...doc })
  }

  static fromMap(map: AcceptMessage | Record<string, unknown>) {
    return new AcceptMessage(
      map.id as string,
      map.message as string,
      new Date(map.creationDate as Date),
      new Date(map.lastUpdateDate as Date),
    )
  }

  toMap(): Omit<AcceptMessage, 'toMap'> {
    return {
      id: this.id,
      message: this.message,
      creationDate: this.creationDate,
      lastUpdateDate: this.lastUpdateDate,
    }
  }
}

export type AcceptMessageCreateBody = Partial<Pick<AcceptMessage, 'message' | 'creationDate'>>

export type AcceptMessageUpdateBody = Partial<Pick<AcceptMessage, 'message' | 'lastUpdateDate'>>
