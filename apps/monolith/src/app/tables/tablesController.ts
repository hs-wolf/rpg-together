import { Body, Controller, Delete, Get, Path, Post, Put, Request, Route, Security, Tags } from 'tsoa';
import { Inject } from 'typescript-ioc';
import { selfOnly } from '@rpg-together/middlewares';
import { Table, TableCreateBodyRequest, TableUpdateBodyRequest, TsoaRequest } from '@rpg-together/models';
import { SECURITY_NAME_BEARER } from '@rpg-together/utils';
import { TablesService } from './tablesService';

@Tags('Tables Service')
@Route('/tables')
export class TablesController extends Controller {
  @Inject
  private _tableService: TablesService;

  @Security(SECURITY_NAME_BEARER)
  @Post('/')
  public async createTable(@Request() request: TsoaRequest, @Body() body: TableCreateBodyRequest): Promise<Table> {
    return this._tableService.createTable(request.user.uid, body);
  }

  @Get('/from-user/{userId}')
  public async getTablesFromUser(@Path() userId: string): Promise<Table[]> {
    return this._tableService.getTablesFromUser(userId);
  }

  @Get('/{tableId}')
  public async getTable(@Path() tableId: string): Promise<Table> {
    return this._tableService.getTable(tableId);
  }

  @Security(SECURITY_NAME_BEARER)
  @Put('/{tableId}')
  public async updateTable(
    @Request() request: TsoaRequest,
    @Path() tableId: string,
    @Body() body: TableUpdateBodyRequest
  ): Promise<Table> {
    const table = await this._tableService.getTable(tableId);
    selfOnly(request, table.owner.id);
    return this._tableService.updateTable(table, body);
  }

  @Security(SECURITY_NAME_BEARER)
  @Delete('/{tableId}')
  public async deleteTable(@Request() request: TsoaRequest, @Path() tableId: string): Promise<void> {
    const table = await this._tableService.getTable(tableId);
    selfOnly(request, table.owner.id);
    return this._tableService.deleteTable(table);
  }
}
