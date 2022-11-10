import { Body, Controller, Get, Path, Put, Route, Security, Tags } from 'tsoa';
import { Inject } from 'typescript-ioc';
import { UsersService } from './usersService';
import { User, UserUpdateRequest } from '@rpg-together/models';
import { SECURITY_NAME_BEARER } from '@rpg-together/utils';

@Tags('Users Service')
@Route('/users')
export class UsersController extends Controller {
  @Inject
  private _userService: UsersService;

  @Get('/{userId}')
  public async getUser(@Path() userId: string): Promise<User> {
    return this._userService.getUser(userId);
  }

  @Security(SECURITY_NAME_BEARER)
  @Put('/{userId}')
  public async updateUser(@Path() userId: string, @Body() body: UserUpdateRequest): Promise<User> {
    return this._userService.updateUser(userId, body);
  }
}
