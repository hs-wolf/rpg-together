import { extname } from 'node:path'
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from 'firebase/storage'
import {
  BUCKET_NAME_TABLES,
  DEFAULT_ANNOUNCEMENT_NAME,
  DEFAULT_USER_AVATAR_NAME,
} from '@rpg-together/utilities'
import type { IUploadRepository } from './uploadRepositoryInterface'

export class UploadRepositoryFirebase implements IUploadRepository {
  private storage = getStorage()

  async uploadUserImage(
    userId: string,
    multerFile: Express.Multer.File,
  ): Promise<string> {
    const fileName = `${DEFAULT_USER_AVATAR_NAME}${extname(multerFile.originalname)}`
    const storageRef = ref(this.storage, `users/${userId}/${fileName}`)
    const snapshot = await uploadBytes(storageRef, multerFile.buffer, {
      contentType: multerFile.mimetype,
    })
    return getDownloadURL(snapshot.ref)
  }

  async uploadAnnouncementImage(
    announcementId: string,
    multerFile: Express.Multer.File,
  ): Promise<string> {
    const fileName = `${DEFAULT_ANNOUNCEMENT_NAME}${extname(
      multerFile.originalname,
    )}`
    const storageRef = ref(this.storage, `announcements/${announcementId}/${fileName}`)
    const snapshot = await uploadBytes(storageRef, multerFile.buffer, {
      contentType: multerFile.mimetype,
    })
    return getDownloadURL(snapshot.ref)
  }

  async deleteAllUserFiles(userId: string): Promise<void> {
    const storageRef = ref(this.storage, `users/${userId}`)
    const itemsList = (await listAll(storageRef)).items
    await Promise.all(itemsList.map(async item => await deleteObject(item)))
  }

  async uploadTableFile(
    tableId: string,
    multerFile: Express.Multer.File,
  ): Promise<string> {
    const storageRef = ref(this.storage, `${BUCKET_NAME_TABLES}/${tableId}/${multerFile.originalname}`)
    const uploadResult = await uploadBytes(storageRef, multerFile.buffer, {
      contentType: multerFile.mimetype,
    })
    return getDownloadURL(uploadResult.ref)
  }

  async deleteTableFile(tableId: string, fileName: string): Promise<void> {
    const url = `${BUCKET_NAME_TABLES}/${tableId}/${fileName}`
    const storageRef = ref(this.storage, url)
    await deleteObject(storageRef)
  }
}
