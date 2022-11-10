import { Body, Controller, Delete, Get, Path, Post, Put, Route, Security, Tags } from 'tsoa';
import { Inject } from 'typescript-ioc';
import { TablesService } from './tablesService';
import { Table, TableCreateRequest, TableUpdateRequest } from '@rpg-together/models';
import { SECURITY_NAME_BEARER } from '@rpg-together/utils';

@Tags('Tables Service')
@Route('/tables')
export class TablesController extends Controller {
  @Inject
  private _tableService: TablesService;

  @Get('/from-user/{userId}')
  public async getTablesFromUser(@Path() userId: string): Promise<Table[]> {
    return this._tableService.getTablesFromUser(userId);
  }

  @Get('/{tableId}')
  public async getTable(@Path() tableId: string): Promise<Table> {
    return this._tableService.getTable(tableId);
  }

  @Security(SECURITY_NAME_BEARER)
  @Post('/')
  public async createTable(@Body() body: TableCreateRequest): Promise<Table> {
    return this._tableService.createTable(body);
  }

  @Security(SECURITY_NAME_BEARER)
  @Put('/{tableId}')
  public async updateTable(@Path() tableId: string, @Body() body: TableUpdateRequest): Promise<Table> {
    return this._tableService.updateTable(tableId, body);
  }

  @Security(SECURITY_NAME_BEARER)
  @Delete('/{tableId}')
  public async deleteTable(@Path() tableId: string): Promise<void> {
    return this._tableService.deleteTable(tableId);
  }
}
