import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa'
import { selfOnly } from '@rpg-together/middlewares'
import type {
  AcceptMessage,
  Application,
  ApplicationCreateBodyRequest,
  TsoaRequest,
} from '@rpg-together/models'
import {
  ApplicationStatus,
} from '@rpg-together/models'
import { SECURITY_NAME_BEARER } from '@rpg-together/utilities'
import { ApplicationsService } from './applicationsService'

@Tags('Applications Service')
@Route('/applications')
export class ApplicationsController extends Controller {
  @Security(SECURITY_NAME_BEARER)
  @Post('/')
  public async createApplication(
    @Request() request: TsoaRequest,
    @Body() body: ApplicationCreateBodyRequest,
  ): Promise<Application> {
    return new ApplicationsService().createApplication(request.user.uid, body)
  }

  @Security(SECURITY_NAME_BEARER)
  @Get('/from-user/{userId}')
  public async getApplicationsFromUser(
    @Path() userId: string,
  ): Promise<Application[]> {
    return new ApplicationsService().getApplicationsFromUser(userId)
  }

  @Security(SECURITY_NAME_BEARER)
  @Get('/from-table/{tableId}')
  public async getApplicationsFromTable(
    @Path() tableId: string,
  ): Promise<Application[]> {
    return new ApplicationsService().getApplicationsFromTable(tableId)
  }

  @Security(SECURITY_NAME_BEARER)
  @Get('/from-user/{userId}/from-table/{tableId}')
  public async getApplicationFromUserAndTable(
    @Path() userId: string,
    @Path() tableId: string,
  ): Promise<Application> {
    return new ApplicationsService().getApplicationFromUserAndTable(
      userId,
      tableId,
    )
  }

  @Security(SECURITY_NAME_BEARER)
  @Get('/{applicationId}')
  public async getApplication(
    @Path() applicationId: string,
  ): Promise<Application> {
    return new ApplicationsService().getApplication(applicationId)
  }

  @Security(SECURITY_NAME_BEARER)
  @Post('/{applicationId}/accept')
  public async acceptApplication(
    @Request() request: TsoaRequest,
    @Path() applicationId: string,
  ): Promise<void> {
    return new ApplicationsService().changeApplicationStatus(
      applicationId,
      request.user.uid,
      ApplicationStatus.ACCEPTED,
    )
  }

  @Security(SECURITY_NAME_BEARER)
  @Post('/{applicationId}/decline')
  public async declineApplication(
    @Request() request: TsoaRequest,
    @Path() applicationId: string,
  ): Promise<void> {
    return new ApplicationsService().changeApplicationStatus(
      applicationId,
      request.user.uid,
      ApplicationStatus.DECLINED,
    )
  }

  @Security(SECURITY_NAME_BEARER)
  @Delete('/{applicationId}')
  public async deleteApplication(
    @Request() request: TsoaRequest,
    @Path() applicationId: string,
  ): Promise<void> {
    const application = await new ApplicationsService().getApplication(
      applicationId,
    )
    selfOnly(request, application.applicant.id)
    return new ApplicationsService().deleteApplication(application)
  }

  @Security(SECURITY_NAME_BEARER)
  @Get('/{applicationId}/accept-message')
  public async getAcceptMessage(@Request() request: TsoaRequest, @Path() applicationId: string): Promise<AcceptMessage> {
    const application = await new ApplicationsService().getApplication(applicationId)
    selfOnly(request, application.applicant.id)
    return new ApplicationsService().getApplicationAcceptMessage(application)
  }
}
