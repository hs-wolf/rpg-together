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
  DEFAULT_ANNOUNCEMENT_NAME,
  DEFAULT_TABLE_BANNER_NAME,
  DEFAULT_USER_AVATAR_NAME,
} from '@rpg-together/utilities'
import type { IUploadRepository } from './uploadRepositoryInterface'

export class UploadRepositoryFirebase implements IUploadRepository {
  private storage = getStorage()

  async uploadUserImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const fileName = `${DEFAULT_USER_AVATAR_NAME}${extname(file.originalname)}`
    const storageRef = ref(this.storage, `users/${userId}/${fileName}`)
    const snapshot = await uploadBytes(storageRef, file.buffer, {
      contentType: file.mimetype,
    })
    return getDownloadURL(snapshot.ref)
  }

  async uploadTableImage(
    tableId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const fileName = `${DEFAULT_TABLE_BANNER_NAME}${extname(
      file.originalname,
    )}`
    const storageRef = ref(this.storage, `tables/${tableId}/${fileName}`)
    const snapshot = await uploadBytes(storageRef, file.buffer, {
      contentType: file.mimetype,
    })
    return getDownloadURL(snapshot.ref)
  }

  async uploadAnnouncementImage(
    announcementId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const fileName = `${DEFAULT_ANNOUNCEMENT_NAME}${extname(
      file.originalname,
    )}`
    const storageRef = ref(this.storage, `announcements/${announcementId}/${fileName}`)
    const snapshot = await uploadBytes(storageRef, file.buffer, {
      contentType: file.mimetype,
    })
    return getDownloadURL(snapshot.ref)
  }

  async deleteAllUserFiles(userId: string): Promise<void> {
    const storageRef = ref(this.storage, `users/${userId}`)
    const itemsList = (await listAll(storageRef)).items
    await Promise.all(itemsList.map(async item => await deleteObject(item)))
  }

  async deleteAllTableFiles(tableId: string): Promise<void> {
    const storageRef = ref(this.storage, `tables/${tableId}`)
    const itemsList = (await listAll(storageRef)).items
    await Promise.all(itemsList.map(async item => await deleteObject(item)))
  }
}
