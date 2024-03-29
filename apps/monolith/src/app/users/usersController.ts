import {
  Body,
  Controller,
  Get,
  Path,
  Put,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa'
import type { TsoaRequest, User, UserUpdateBodyRequest } from '@rpg-together/models'
import { SECURITY_NAME_BEARER } from '@rpg-together/utilities'
import { UsersService } from './usersService'

@Tags('Users Service')
@Route('/users')
export class UsersController extends Controller {
  @Get('/{userId}')
  public async getUser(@Path() userId: string): Promise<User> {
    return new UsersService().getUser(userId)
  }

  @Security(SECURITY_NAME_BEARER)
  @Put('/')
  public async updateUser(
    @Request() request: TsoaRequest,
    @Body() body: UserUpdateBodyRequest,
  ): Promise<User> {
    return new UsersService().updateUser(request.user.uid, body)
  }
}
