import { Body, Controller, Delete, Get, Path, Post, Request, Route, Security, Tags } from 'tsoa';
import { Inject } from 'typescript-ioc';
import { ApplicationsService } from './applicationsService';
import { selfOnly } from '@rpg-together/middlewares';
import { Application, ApplicationCreateBody, ApplicationStatus, TsoaRequest } from '@rpg-together/models';
import { SECURITY_NAME_BEARER } from '@rpg-together/utils';

@Tags('Applications Service')
@Route('/applications')
export class ApplicationsController extends Controller {
  @Inject
  private _applicationsService: ApplicationsService;

  @Get('/existing/{tableId}/{userId}')
  public async getExistingApplication(@Path() tableId: string, @Path() userId: string): Promise<Application[]> {
    return this._applicationsService.getExistingApplication(tableId, userId);
  }

  @Get('/from-user/{userId}')
  public async getApplicationsFromUser(@Path() userId: string): Promise<Application[]> {
    return this._applicationsService.getApplicationsFromUser(userId);
  }

  @Get('/from-table/{tableId}')
  public async getApplicationsFromTable(@Path() tableId: string): Promise<Application[]> {
    return this._applicationsService.getApplicationsFromTable(tableId);
  }

  @Get('/{applicationId}')
  public async getApplication(@Path() applicationId: string): Promise<Application> {
    return this._applicationsService.getApplication(applicationId);
  }

  @Security(SECURITY_NAME_BEARER)
  @Post('/')
  public async createApplication(@Request() request: TsoaRequest, @Body() body: ApplicationCreateBody): Promise<Application> {
    return this._applicationsService.createApplication(request.user.uid, body);
  }

  @Security(SECURITY_NAME_BEARER)
  @Post('/{applicationId}/accept')
  public async acceptApplication(@Request() request: TsoaRequest, @Path() applicationId: string): Promise<void> {
    return this._applicationsService.changeApplicationStatus(applicationId, request.user.uid, ApplicationStatus.ACCEPTED);
  }

  @Security(SECURITY_NAME_BEARER)
  @Post('/{applicationId}/decline')
  public async declineApplication(@Request() request: TsoaRequest, @Path() applicationId: string): Promise<void> {
    return this._applicationsService.changeApplicationStatus(applicationId, request.user.uid, ApplicationStatus.DECLINED);
  }

  @Security(SECURITY_NAME_BEARER)
  @Delete('/{applicationId}')
  public async deleteApplication(@Request() request: TsoaRequest, @Path() applicationId: string): Promise<void> {
    const application = await this._applicationsService.getApplication(applicationId);
    selfOnly(request, application.applicantId);
    return this._applicationsService.deleteApplication(application);
  }
}