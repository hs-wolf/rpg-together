import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags } from 'tsoa';
import { Inject } from 'typescript-ioc';
import { UsersService } from './usersService';
import { User, UserCreationBody, UserUpdateBody } from '@rpg-together/models';
import { SECURITY_NAME_BEARER } from '@rpg-together/utils';

@Tags('Users Service')
@Route('/users')
export class UsersController extends Controller {
  @Inject
  private _userService: UsersService;

  // @Security(SECURITY_NAME_BEARER)
  @Get('/{userId}')
  public async getUser(@Path() userId: string): Promise<User> {
    return this._userService.getUser(userId);
  }

  @Security(SECURITY_NAME_BEARER)
  @Post('/{userId}')
  public async createUser(@Path() userId: string, @Body() body: UserCreationBody): Promise<User> {
    return this._userService.createUser(userId, body);
  }

  @Security(SECURITY_NAME_BEARER)
  @Put('/{userId}')
  public async updateUser(@Path() userId: string, @Body() body: UserUpdateBody): Promise<User> {
    return this._userService.updateUser(userId, body);
  }

  @Security(SECURITY_NAME_BEARER)
  @Delete('/{userId}')
  public async deleteUser(@Path() userId: string): Promise<void> {
    return this._userService.deleteUser(userId);
  }
}
