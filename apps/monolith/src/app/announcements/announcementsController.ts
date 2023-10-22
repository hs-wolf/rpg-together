import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Route,
  Security,
  Tags,
} from 'tsoa'
import { type Announcement, type AnnouncementUpdateBodyRequest, UserRoles } from '@rpg-together/models'
import { SECURITY_NAME_BEARER } from '@rpg-together/utilities'
import { AnnouncementsService } from './announcementsService'

@Tags('Announcements Service')
@Route('/announcements')
export class AnnouncementsController extends Controller {
  @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Post('/')
  public async createAnnouncement(
    @Body() body: AnnouncementUpdateBodyRequest,
  ): Promise<Announcement> {
    return new AnnouncementsService().createAnnouncement(body)
  }

  @Get('/{announcementId}')
  public async getAnnouncement(@Path() announcementId: string): Promise<Announcement> {
    return new AnnouncementsService().getAnnouncement(announcementId)
  }

  @Get('/')
  public async getAnnouncements(): Promise<Announcement[]> {
    return new AnnouncementsService().getAnnouncements()
  }

  @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Put('/{announcementId}')
  public async updateAnnouncement(
    @Path() announcementId: string,
    @Body() body: AnnouncementUpdateBodyRequest,
  ): Promise<Announcement> {
    return new AnnouncementsService().updateAnnouncement(announcementId, body)
  }

  @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Delete('/{announcementId}')
  public async deleteAnnouncement(
    @Path() announcementId: string,
  ): Promise<void> {
    return new AnnouncementsService().deleteAnnouncement(announcementId)
  }
}
