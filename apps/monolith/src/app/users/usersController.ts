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

@Tags('Users')
@Route('/users')
export class UsersController extends Controller {
  private _userService = new UsersService()

  @Get('/{userId}')
  public async getUser(@Path() userId: string): Promise<User> {
    return this._userService.getUser(userId)
  }

  @Security(SECURITY_NAME_BEARER)
  @Put('/')
  public async updateUser(
    @Request() request: TsoaRequest,
    @Body() body: UserUpdateBodyRequest,
  ): Promise<User> {
    return this._userService.updateUser(request.user.uid, body)
  }
}
