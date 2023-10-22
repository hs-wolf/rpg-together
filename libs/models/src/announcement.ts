import type { Document } from 'mongodb'
import type { SupportedLanguages } from '.'

export class Announcement {
  constructor(
    public id: string,
    public title: Record<SupportedLanguages, string>,
    public message: Record<SupportedLanguages, string>,
    public image: string,
    public creationDate: Date,
    public lastUpdateDate: Date,
  ) {}

  static fromMongoDB(doc: Document | null): Announcement | null {
    if (!doc)
      return null

    return Announcement.fromMap({ ...doc })
  }

  static fromMap(map: Announcement | Record<string, unknown>) {
    return new Announcement(
      map.id as string,
      map.title as Record<SupportedLanguages, string>,
      map.message as Record<SupportedLanguages, string>,
      map.image as string,
      new Date(map.creationDate as Date),
      new Date(map.lastUpdateDate as Date),
    )
  }

  toMap(): Omit<Announcement, 'toMap'> {
    return {
      id: this.id,
      title: this.title,
      message: this.message,
      image: this.image,
      creationDate: this.creationDate,
      lastUpdateDate: this.lastUpdateDate,
    }
  }
}

export type AnnouncementCreateBody = Partial<
  Pick<Announcement, 'title' | 'message' | 'image'>
>

export type AnnouncementsCreateBodyRequest = Pick<
AnnouncementCreateBody,
  'title' | 'message' | 'image'
>

export type AnnouncementUpdateBody = Partial<
  Pick<Announcement, 'title' | 'message' | 'image' | 'lastUpdateDate'>
>

export type AnnouncementUpdateBodyRequest = Partial<Pick<AnnouncementUpdateBody, 'title' | 'message' | 'image'>>
