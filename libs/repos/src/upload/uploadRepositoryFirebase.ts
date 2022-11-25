import { extname } from 'path';
import {} from 'firebase-admin/storage';
import { IUploadRepository } from './uploadRepositoryInterface';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

export class UploadRepositoryFirebase implements IUploadRepository {
  private storage = getStorage();

  async uploadImage(userId: string, file: Express.Multer.File): Promise<string> {
    const fileName = `avatar${extname(file.originalname)}`;
    const mountainImagesRef = ref(this.storage, `${userId}/images/${fileName}`);
    const snapshot = await uploadBytes(mountainImagesRef, file.buffer, { contentType: file.mimetype });
    return getDownloadURL(snapshot.ref);
  }
}
