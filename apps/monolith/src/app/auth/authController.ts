import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa'
import { Inject } from 'typescript-ioc'
import type {
  AuthUserRegisterBody,
  AuthUserUpdateBody,
  TsoaRequest,
} from '@rpg-together/models'
import {
  UserRoles,
} from '@rpg-together/models'
import { SECURITY_NAME_BEARER } from '@rpg-together/utilities'
import type { AuthService } from './authService'

@Tags('Authentication Service')
@Route('/auth')
export class AuthController extends Controller {
  @Inject
  private service: AuthService

  @Post('/register/user')
  public async userRegister(@Body() body: AuthUserRegisterBody): Promise<void> {
    return this.service.userRegister(body)
  }

  @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Post('/register/admin')
  public async adminRegister(
    @Body() body: AuthUserRegisterBody,
  ): Promise<void> {
    return this.service.adminRegister(body)
  }

  @Security(SECURITY_NAME_BEARER)
  @Put('/update')
  public async updateAuthUser(
    @Request() request: TsoaRequest,
    @Body() body: AuthUserUpdateBody,
  ): Promise<void> {
    return this.service.updateAuthUser(request.user.uid, body)
  }

  @Security(SECURITY_NAME_BEARER)
  @Delete('/delete')
  public async deleteAuthUser(@Request() request: TsoaRequest): Promise<void> {
    return this.service.deleteAuthUser(request.user.uid)
  }
}
