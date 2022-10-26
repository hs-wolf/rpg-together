import { Controller, Route, Tags, Body, Post, Security } from 'tsoa';
import { Inject } from 'typescript-ioc';
import { AuthService } from './authService';
import { UserRoles, UserRegisterBody } from '@rpg-together/models';
import { SECURITY_NAME_BEARER } from '@rpg-together/utils';

@Tags('Authentication Service')
@Route('/auth')
export class AuthController extends Controller {
  @Inject
  private service: AuthService;

  @Post('/register/user')
  public async userRegister(@Body() body: UserRegisterBody): Promise<void> {
    return this.service.userRegister(body);
  }

  @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Post('/register/admin')
  public async adminRegister(@Body() body: UserRegisterBody): Promise<void> {
    return this.service.adminRegister(body);
  }
}
