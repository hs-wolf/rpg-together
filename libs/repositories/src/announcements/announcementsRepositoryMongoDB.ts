import type { Db } from 'mongodb'
import { ObjectId } from 'mongodb'
import { Announcement } from '@rpg-together/models'
import { MONGODB_COLLECTION_ANNOUNCEMENTS } from '@rpg-together/utilities'
import type { IAnnouncementsRepository } from './announcementsRepositoryInterface'

export class AnnouncementsRepositoryMongoDB implements IAnnouncementsRepository {
  constructor(private mongoDB: Db) {}

  private _collection = this.mongoDB.collection(MONGODB_COLLECTION_ANNOUNCEMENTS)

  async createAnnouncement(announcement: Announcement) {
    const newAnnouncement = announcement
    const _id = new ObjectId()
    newAnnouncement.id = _id.toString()
    await this._collection.insertOne({ _id, ...newAnnouncement.toMap() })
    return newAnnouncement
  }

  async getAnnouncement(announcementId: string) {
    const doc = await this._collection.findOne({ id: announcementId })
    return Announcement.fromMongoDB(doc)
  }

  async getAnnouncements() {
    const docs = await this._collection.find().toArray()
    return docs
      .map(doc => Announcement.fromMongoDB(doc))
      .filter(table => table) as Announcement[]
  }

  async updateAnnouncement(announcement: Announcement) {
    await this._collection.updateOne({ id: announcement.id }, { $set: announcement.toMap() })
  }

  async deleteAnnouncement(announcementId: string) {
    await this._collection.deleteOne({ id: announcementId })
  }
}
