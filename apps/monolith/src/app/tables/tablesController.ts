import {
  Body,
  Controller,
  Delete,
  FormField,
  Get,
  Path,
  Post,
  Put,
  Request,
  Route,
  Security,
  Tags,
  UploadedFile,
} from 'tsoa'
import { selfOnly } from '@rpg-together/middlewares'
import type {
  AcceptMessage,
  Table,
  TableCreateBodyRequest,
  TableUpdateBodyRequest,
  TsoaRequest,
} from '@rpg-together/models'
import { SECURITY_NAME_BEARER } from '@rpg-together/utilities'
import { TablesService } from './tablesService'

@Tags('Tables Service')
@Route('/tables')
export class TablesController extends Controller {
  @Security(SECURITY_NAME_BEARER)
  @Post('/')
  public async createTable(
    @Request() request: TsoaRequest,
    @UploadedFile() bannerFile: Express.Multer.File,
    @FormField() body: string,
  ): Promise<Table> {
    const jsonBody = JSON.parse(body) as TableCreateBodyRequest
    return new TablesService().createTable(request.user.uid, jsonBody, bannerFile)
  }

  @Get('/from-user/{userId}')
  public async getTablesFromUser(@Path() userId: string): Promise<Table[]> {
    return new TablesService().getTablesFromUser(userId)
  }

  @Get('/{tableId}')
  public async getTable(@Path() tableId: string): Promise<Table> {
    return new TablesService().getTable(tableId)
  }

  @Security(SECURITY_NAME_BEARER)
  @Put('/{tableId}')
  public async updateTable(
    @Request() request: TsoaRequest,
    @Path() tableId: string,
    @Body() body: TableUpdateBodyRequest,
  ): Promise<Table> {
    const table = await new TablesService().getTable(tableId)
    selfOnly(request, table.owner.id)
    return new TablesService().updateTable(table, body)
  }

  @Security(SECURITY_NAME_BEARER)
  @Delete('/{tableId}')
  public async deleteTable(
    @Request() request: TsoaRequest,
    @Path() tableId: string,
  ): Promise<void> {
    const table = await new TablesService().getTable(tableId)
    selfOnly(request, table.owner.id)
    return new TablesService().deleteTable(table)
  }

  @Security(SECURITY_NAME_BEARER)
  @Get('/{tableId}/accept-message')
  public async getAcceptMessage(@Request() request: TsoaRequest, @Path() tableId: string): Promise<AcceptMessage> {
    const table = await new TablesService().getTable(tableId)
    selfOnly(request, table.owner.id)
    return new TablesService().getTableAcceptMessage(table)
  }
}
