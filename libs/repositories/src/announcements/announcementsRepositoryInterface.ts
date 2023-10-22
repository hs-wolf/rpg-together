import type { Announcement } from '@rpg-together/models'

export interface IAnnouncementsRepository {
  createAnnouncement(announcement: Announcement): Promise<Announcement | null>

  getAnnouncement(announcementId: string): Promise<Announcement | null>

  getAnnouncements(): Promise<Announcement[]>

  updateAnnouncement(announcement: Announcement): Promise<void>

  deleteAnnouncement(announcementId: string): Promise<void>
}
