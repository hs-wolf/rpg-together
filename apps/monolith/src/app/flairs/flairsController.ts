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
import type {
  Flair,
  FlairCreationBodyRequest,
  FlairUpdateBodyRequest,
} from '@rpg-together/models'
import {
  UserRoles,
} from '@rpg-together/models'
import { SECURITY_NAME_BEARER } from '@rpg-together/utilities'
import { FlairsService } from './flairsService'

@Tags('Flairs Service')
@Route('/flairs')
export class FlairsController extends Controller {
  // @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Post('/')
  public async createFlair(
    @Body() body: FlairCreationBodyRequest,
  ): Promise<Flair> {
    return new FlairsService().createFlair(body)
  }

  @Get('/')
  public async getAllFlairs(): Promise<Flair[]> {
    return new FlairsService().getAllFlairs()
  }

  @Get('/{flairId}')
  public async getFlair(@Path() flairId: string): Promise<Flair> {
    return new FlairsService().getFlair(flairId)
  }

  @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Put('/{flairId}')
  public async updateFlair(
    @Path() flairId: string,
    @Body() body: FlairUpdateBodyRequest,
  ): Promise<Flair> {
    return new FlairsService().updateFlair(flairId, body)
  }

  @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Delete('/{flairId}')
  public async deleteFlair(@Path() flairId: string): Promise<void> {
    return new FlairsService().deleteFlair(flairId)
  }
}
