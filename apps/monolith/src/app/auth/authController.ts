import {
  Body,
  Controller,
  Delete,
  Path,
  Post,
  Put,
  Request,
  Route,
  Security,
  Tags,
} from 'tsoa'
import type {
  AuthUserRegisterBody,
  AuthUserUpdateBody,
  TsoaRequest,
} from '@rpg-together/models'
import {
  UserRoles,
} from '@rpg-together/models'
import { SECURITY_NAME_BEARER } from '@rpg-together/utilities'
import { AuthService } from './authService'

@Tags('Authentication')
@Route('/auth')
export class AuthController extends Controller {
  private _authService = new AuthService()

  @Post('/register/user')
  public async userRegister(@Body() body: AuthUserRegisterBody): Promise<void> {
    return this._authService.userRegister(body)
  }

  @Security(SECURITY_NAME_BEARER, [UserRoles.ADMIN])
  @Post('/register/admin')
  public async adminRegister(
    @Body() body: AuthUserRegisterBody,
  ): Promise<void> {
    return this._authService.adminRegister(body)
  }

  @Security(SECURITY_NAME_BEARER)
  @Put('/update')
  public async updateAuthUser(
    @Request() request: TsoaRequest,
    @Body() body: AuthUserUpdateBody,
  ): Promise<void> {
    return this._authService.updateAuthUser(request.user.uid, body)
  }

  @Security(SECURITY_NAME_BEARER)
  @Delete('/delete')
  public async deleteAuthUser(@Request() request: TsoaRequest): Promise<void> {
    return this._authService.deleteAuthUser(request.user.uid)
  }

  @Post('/verify-recaptcha/{token}')
  public async verifyRecaptcha(@Path() token: string): Promise<void> {
    return this._authService.recaptchaVerify(token)
  }
}
