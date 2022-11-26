import { extname } from 'path';
import {} from 'firebase-admin/storage';
import { IUploadRepository } from './uploadRepositoryInterface';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { DEFAULT_USER_AVATAR_NAME, DEFAULT_TABLE_BANNER_NAME } from '@rpg-together/utils';

export class UploadRepositoryFirebase implements IUploadRepository {
  private storage = getStorage();

  async uploadUserImage(userId: string, file: Express.Multer.File): Promise<string> {
    const fileName = `${DEFAULT_USER_AVATAR_NAME}${extname(file.originalname)}`;
    const mountainImagesRef = ref(this.storage, `users/${userId}/images/${fileName}`);
    const snapshot = await uploadBytes(mountainImagesRef, file.buffer, { contentType: file.mimetype });
    return getDownloadURL(snapshot.ref);
  }

  async uploadTableImage(tableId: string, file: Express.Multer.File): Promise<string> {
    const fileName = `${DEFAULT_TABLE_BANNER_NAME}${extname(file.originalname)}`;
    const mountainImagesRef = ref(this.storage, `tables/${tableId}/images/${fileName}`);
    const snapshot = await uploadBytes(mountainImagesRef, file.buffer, { contentType: file.mimetype });
    return getDownloadURL(snapshot.ref);
  }
}
