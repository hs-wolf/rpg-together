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
import { Inject } from 'typescript-ioc'
import type { TsoaRequest } from '@rpg-together/models'
import { SECURITY_NAME_BEARER } from '@rpg-together/utilities'
import { selfOnly } from '@rpg-together/middlewares'
import type { TablesService } from '../tables/tablesService'
import type { UploadService } from './uploadService'

@Tags('Upload Service')
@Route('/upload')
export class UploadController extends Controller {
  @Inject
  private service: UploadService

  @Inject
  private tablesService: TablesService

  @Security(SECURITY_NAME_BEARER)
  @Post('/user-file')
  public async uploadUserFile(
    @Request() request: TsoaRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    return this.service.uploadUserFile(request.user.uid, file)
  }

  @Security(SECURITY_NAME_BEARER)
  @Post('/table-file/{tableId}')
  public async uploadTableFile(
    @Request() request: TsoaRequest,
    @Path() tableId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    const table = await this.tablesService.getTable(tableId)
    selfOnly(request, table.owner.id)
    return this.service.uploadTableFile(tableId, file)
  }
}
