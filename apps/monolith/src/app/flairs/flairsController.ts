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
import { Inject } from 'typescript-ioc'
import type {
  Flair,
  FlairCreationBodyRequest,
  FlairUpdateBodyRequest,
} from '@rpg-together/models'
import {
  UserRoles,
} from '@rpg-together/models'
import { SECURITY_NAME_BEARER } from '@rpg-together/utilities'
import type { FlairsService } from './flairsService'

@Tags('Flairs Service')
@Route('/flairs')
export class FlairsController extends Controller {
  @Inject
  private _flairService: FlairsService

  @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Post('/')
  public async createFlair(
    @Body() body: FlairCreationBodyRequest,
  ): Promise<Flair> {
    return this._flairService.createFlair(body)
  }

  @Get('/')
  public async getAllFlairs(): Promise<Flair[]> {
    return this._flairService.getAllFlairs()
  }

  @Get('/{flairId}')
  public async getFlair(@Path() flairId: string): Promise<Flair> {
    return this._flairService.getFlair(flairId)
  }

  @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Put('/{flairId}')
  public async updateFlair(
    @Path() flairId: string,
    @Body() body: FlairUpdateBodyRequest,
  ): Promise<Flair> {
    return this._flairService.updateFlair(flairId, body)
  }

  @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Delete('/{flairId}')
  public async deleteFlair(@Path() flairId: string): Promise<void> {
    return this._flairService.deleteFlair(flairId)
  }
}
