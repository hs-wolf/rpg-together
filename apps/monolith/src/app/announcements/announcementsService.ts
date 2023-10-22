import type {
  AnnouncementCreateBody,
  AnnouncementUpdateBody,
} from '@rpg-together/models'
import {
  Announcement,
  ApiError,
  ResponseCodes,
  ResponseMessages,
} from '@rpg-together/models'
import type { IAnnouncementsRepository } from '@rpg-together/repositories'
import {
  AnnouncementsRepositoryMongoDB,
} from '@rpg-together/repositories'
import { apiErrorHandler } from '@rpg-together/utilities'
import { mongoDB } from '../../mongodb'

export class AnnouncementsService {
  constructor(announcementsRepo?: IAnnouncementsRepository) {
    this._announcementsRepo = announcementsRepo ?? new AnnouncementsRepositoryMongoDB(mongoDB)
  }

  private _announcementsRepo: IAnnouncementsRepository

  async createAnnouncement(body: AnnouncementCreateBody): Promise<Announcement> {
    try {
      const currentDate = new Date()
      let newAnnouncement = Announcement.fromMap({ ...body })
      newAnnouncement.creationDate = currentDate
      newAnnouncement.lastUpdateDate = currentDate
      newAnnouncement = await this._announcementsRepo.createAnnouncement(newAnnouncement)
      return newAnnouncement
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getAnnouncement(announcementId: string): Promise<Announcement> {
    try {
      const announcement = await this._announcementsRepo.getAnnouncement(announcementId)
      if (!announcement) {
        throw new ApiError(
          ResponseCodes.NOT_FOUND,
          ResponseMessages.ANNOUNCEMENT_NOT_FOUND,
        )
      }
      return announcement
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async getAnnouncements(): Promise<Announcement[]> {
    try {
      return await this._announcementsRepo.getAnnouncements()
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async updateAnnouncement(announcementId: string, body: AnnouncementUpdateBody): Promise<Announcement> {
    try {
      const oldAnnouncement = await this.getAnnouncement(announcementId)
      const newAnnouncement = Announcement.fromMap({ ...oldAnnouncement, ...body })
      newAnnouncement.lastUpdateDate = new Date()
      await this._announcementsRepo.updateAnnouncement(newAnnouncement)
      return newAnnouncement
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteAnnouncement(announcementId: string) {
    try {
      await this._announcementsRepo.deleteAnnouncement(announcementId)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }
}
