import { Multer } from 'multer'

export interface IUploadRepository {
  uploadUserImage(userId: string, file: Express.Multer.File): Promise<string>

  uploadTableImage(tableId: string, file: Express.Multer.File): Promise<string>

  uploadAnnouncementImage(announcementId: string, file: Express.Multer.File): Promise<string>

  deleteAllUserFiles(userId: string): Promise<void>

  deleteAllTableFiles(tableId: string): Promise<void>
}
