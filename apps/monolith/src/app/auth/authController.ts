import { Controller, Route, Tags, Body, Post, Security, Request, Delete, Put } from 'tsoa';
import { Inject } from 'typescript-ioc';
import { AuthService } from './authService';
import { UserRoles, AuthUserRegisterBody, TsoaRequest, AuthUserUpdateBody } from '@rpg-together/models';
import { SECURITY_NAME_BEARER } from '@rpg-together/utils';

@Tags('Authentication Service')
@Route('/auth')
export class AuthController extends Controller {
  @Inject
  private service: AuthService;

  @Post('/register/user')
  public async userRegister(@Body() body: AuthUserRegisterBody): Promise<void> {
    return this.service.userRegister(body);
  }

  @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Post('/register/admin')
  public async adminRegister(@Body() body: AuthUserRegisterBody): Promise<void> {
    return this.service.adminRegister(body);
  }

  @Security(SECURITY_NAME_BEARER)
  @Put('/update')
  public async updateAuthUser(@Request() request: TsoaRequest, @Body() body: AuthUserUpdateBody): Promise<void> {
    return this.service.updateAuthUser(request.user.uid, body);
  }

  @Security(SECURITY_NAME_BEARER)
  @Delete('/delete')
  public async accountDelete(@Request() request: TsoaRequest): Promise<void> {
    return this.service.accountDelete(request.user.uid);
  }
}