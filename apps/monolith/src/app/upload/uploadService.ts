import { Singleton } from 'typescript-ioc'
import {
  ApiError,
  ResponseCodes,
  ResponseMessages,
} from '@rpg-together/models'
import type { IUploadRepository } from '@rpg-together/repositories'
import {
  UploadRepositoryFirebase,
} from '@rpg-together/repositories'
import { apiErrorHandler } from '@rpg-together/utilities'

@Singleton
export class UploadService {
  private _uploadRepo: IUploadRepository

  constructor(uploadRepo: IUploadRepository) {
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
  ): Promise<string> {
    try {
      if (file.mimetype.includes('image')) {
        const url = await this._uploadRepo.uploadTableImage(tableid, file)
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
