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
import { selfOnly } from '@rpg-together/middlewares'
import { TablesService } from '../tables/tablesService'
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
  @Post('/table-file/{tableId}')
  public async uploadTableFile(
    @Request() request: TsoaRequest,
    @Path() tableId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    const table = await new TablesService().getTable(tableId)
    selfOnly(request, table.owner.id)
    return new UploadService().uploadTableFile(tableId, file)
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
