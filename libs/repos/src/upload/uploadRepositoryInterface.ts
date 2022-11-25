import { Multer } from 'multer';

export interface IUploadRepository {
  uploadImage(userId: string, file: Express.Multer.File): Promise<string>;
}
