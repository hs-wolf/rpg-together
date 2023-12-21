import { Multer } from 'multer'

export interface IUploadRepository {
  uploadUserImage(userId: string, multerFile: Express.Multer.File): Promise<string>

  uploadAnnouncementImage(announcementId: string, multerFile: Express.Multer.File): Promise<string>

  deleteAllUserFiles(userId: string): Promise<void>

  uploadTableFile(tableId: string, multerFile: Express.Multer.File): Promise<string>

  deleteTableFile(tableId: string, fileName: string): Promise<void>
}
