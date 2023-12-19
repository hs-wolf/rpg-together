import {
  ApiError,
  ResponseCodes,
  ResponseMessages,
} from '@rpg-together/models'
import type { IUploadRepository } from '@rpg-together/repositories'
import {
  UploadRepositoryFirebase,
} from '@rpg-together/repositories'
import { TABLE_BANNER_MAX_SIZE_IN_MB, apiErrorHandler } from '@rpg-together/utilities'

export class UploadService {
  private _uploadRepo: IUploadRepository

  constructor(uploadRepo?: IUploadRepository) {
    this._uploadRepo = uploadRepo ?? new UploadRepositoryFirebase()
  }

  async uploadUserFile(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      if (file.mimetype.includes('image')) {
        const url = await this._uploadRepo.uploadUserImage(userId, file)
        return url
      }
      throw new ApiError(
        ResponseCodes.BAD_REQUEST,
        ResponseMessages.COULD_NOT_UPLOAD,
      )
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async uploadTableFile(
    tableid: string,
    file: Express.Multer.File,
  ) {
    try {
      if (!file.mimetype.includes('image')) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.FAILED_UPLOAD_FILE_NOT_IMAGE,
        )
      }
      const fileSizeInMB = file.size / (1024 * 1024)
      if (fileSizeInMB > TABLE_BANNER_MAX_SIZE_IN_MB) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.FAILED_UPLOAD_FILE_TOO_BIG,
        )
      }
      const url = await this._uploadRepo.uploadTableImage(tableid, file)
      return url
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async uploadAnnouncementFile(
    announcementId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    try {
      if (file.mimetype.includes('image')) {
        const url = await this._uploadRepo.uploadAnnouncementImage(announcementId, file)
        return url
      }
      throw new ApiError(
        ResponseCodes.BAD_REQUEST,
        ResponseMessages.COULD_NOT_UPLOAD,
      )
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteAllUserFiles(userId: string): Promise<void> {
    try {
      await this._uploadRepo.deleteAllUserFiles(userId)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }

  async deleteAllTableFiles(tableId: string): Promise<void> {
    try {
      await this._uploadRepo.deleteAllTableFiles(tableId)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }
}
