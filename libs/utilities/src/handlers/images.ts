import { extname } from 'node:path'
import type { FormatEnum } from 'sharp'
import sharp from 'sharp'
import { ApiError, ResponseCodes, ResponseMessages } from '@rpg-together/models'
import { apiErrorHandler } from '.'

export async function validateAndFormatImage(multerFile: Express.Multer.File, filename: string, extension: string, maxSizeInMB?: number) {
  try {
    const newFile = multerFile
    if (!newFile.mimetype.includes('image')) {
      throw new ApiError(
        ResponseCodes.BAD_REQUEST,
        ResponseMessages.FAILED_UPLOAD_FILE_NOT_IMAGE,
      )
    }
    if (maxSizeInMB) {
      const fileSizeInMB = newFile.size / (1024 * 1024)
      if (fileSizeInMB > maxSizeInMB) {
        throw new ApiError(
          ResponseCodes.BAD_REQUEST,
          ResponseMessages.FAILED_UPLOAD_FILE_TOO_BIG,
        )
      }
    }
    if (extname(newFile.originalname) !== extension) {
      await sharp(newFile.buffer)
        .toFormat(extension as keyof FormatEnum)
        .toBuffer()
        .then((outputBuffer) => {
          // eslint-disable-next-line no-console
          console.log('A')
          newFile.buffer = outputBuffer
        })
        .catch((_err) => {
          throw new ApiError(
            ResponseCodes.INTERNAL_ERROR,
            ResponseMessages.FAILED_TO_FORMAT_IMAGE,
          )
        })
    }
    newFile.originalname = `${filename ?? 'output'}.${extension}`
    newFile.mimetype = `image/${extension}`
    // eslint-disable-next-line no-console
    console.log('B')
    return newFile
  }
  catch (error) {
    apiErrorHandler(error)
    return undefined
  }
}
