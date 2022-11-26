import { Singleton } from 'typescript-ioc';
import { ApiError, ResponseCodes, ResponseMessages } from '@rpg-together/models';
import { IUploadRepository, UploadRepositoryFirebase } from '@rpg-together/repos';
import { apiErrorHandler } from '@rpg-together/utils';

@Singleton
export class UploadService {
  private _uploadRepo: IUploadRepository;

  constructor(uploadRepo: IUploadRepository) {
    this._uploadRepo = uploadRepo ?? new UploadRepositoryFirebase();
  }

  async uploadUserFile(userId: string, file: Express.Multer.File): Promise<string> {
    try {
      if (file.mimetype.includes('image')) {
        const url = await this._uploadRepo.uploadUserImage(userId, file);
        return url;
      }
      throw new ApiError(ResponseCodes.BAD_REQUEST, ResponseMessages.COULD_NOT_UPLOAD);
    } catch (error) {
      apiErrorHandler(error);
    }
  }

  async uploadTableFile(tableid: string, file: Express.Multer.File): Promise<string> {
    try {
      if (file.mimetype.includes('image')) {
        const url = await this._uploadRepo.uploadTableImage(tableid, file);
        return url;
      }
      throw new ApiError(ResponseCodes.BAD_REQUEST, ResponseMessages.COULD_NOT_UPLOAD);
    } catch (error) {
      apiErrorHandler(error);
    }
  }
}
