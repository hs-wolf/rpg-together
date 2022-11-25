import { Controller, Route, Tags, Post, Security, Request, UploadedFile } from 'tsoa';
import { Inject } from 'typescript-ioc';
import { UploadService } from './uploadService';
import { TsoaRequest } from '@rpg-together/models';
import { SECURITY_NAME_BEARER } from '@rpg-together/utils';

@Tags('Upload Service')
@Route('/upload')
export class UploadController extends Controller {
  @Inject
  private service: UploadService;

  @Security(SECURITY_NAME_BEARER)
  @Post('/user-file')
  public async uploadFile(@Request() request: TsoaRequest, @UploadedFile() file: Express.Multer.File): Promise<string> {
    return this.service.uploadFile(request.user.uid, file);
  }
}
