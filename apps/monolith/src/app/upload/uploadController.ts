import {
  Controller,
  Path,
  Post,
  Request,
  Route,
  Security,
  Tags,
  UploadedFile,
} from 'tsoa'
import type { TsoaRequest } from '@rpg-together/models'
import { SECURITY_NAME_BEARER } from '@rpg-together/utilities'
import { UploadService } from './uploadService'

@Tags('Upload Service')
@Route('/upload')
export class UploadController extends Controller {
  @Security(SECURITY_NAME_BEARER)
  @Post('/user-file')
  public async uploadUserFile(
    @Request() request: TsoaRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return new UploadService().uploadUserFile(request.user.uid, file)
  }

  @Security(SECURITY_NAME_BEARER)
  @Post('/announcement-file/{announcementId}')
  public async uploadAnnouncementFile(
    @Path() announcementId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return new UploadService().uploadAnnouncementFile(announcementId, file)
  }
}
