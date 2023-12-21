import {
  ApiError,
  ResponseCodes,
  ResponseMessages,
} from '@rpg-together/models'
import type { IUploadRepository } from '@rpg-together/repositories'
import {
  UploadRepositoryFirebase,
} from '@rpg-together/repositories'
import { TABLE_DEFAULTS, TABLE_FILE_TYPES, apiErrorHandler, validateAndFormatImage } from '@rpg-together/utilities'

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
    multerFile: Express.Multer.File,
    fileType: TABLE_FILE_TYPES,
  ) {
    try {
      if (fileType === TABLE_FILE_TYPES.BANNER) {
        const newFile = await validateAndFormatImage(multerFile, TABLE_DEFAULTS.BANNER_NAME, TABLE_DEFAULTS.BANNER_EXT, TABLE_DEFAULTS.BANNER_MAX_SIZE_IN_MB)
        const url = await this._uploadRepo.uploadTableFile(tableid, newFile)
        return url
      }
      throw new ApiError(
        ResponseCodes.BAD_REQUEST,
        ResponseMessages.INVALID_FILE_TYPE,
      )
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

  async deleteTableFile(tableId: string, fileType: TABLE_FILE_TYPES): Promise<void> {
    try {
      let fileName = ''
      switch (fileType) {
        case TABLE_FILE_TYPES.ALL:
          fileName = ''
          break
        case TABLE_FILE_TYPES.BANNER:
          fileName = `${TABLE_DEFAULTS.BANNER_NAME}.${TABLE_DEFAULTS.BANNER_EXT}`
          break
        default:
          fileName = ''
          break
      }
      await this._uploadRepo.deleteTableFile(tableId, fileName)
    }
    catch (error) {
      apiErrorHandler(error)
    }
  }
}
